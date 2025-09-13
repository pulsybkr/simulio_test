from typing import Union, List, Dict, Any
import pandas as pd
import numpy as np
import numpy_financial
import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

app = FastAPI(
    title="Simulio Simulation API",
    description="API de calculs financiers pour Simulio",
    version="1.0.0",
)

# Configuration CORS pour permettre les appels depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modèles Pydantic pour la validation des données
class SimulationParameters(BaseModel):
    loanAmount: float = Field(..., gt=0, le=10000000, description="Montant du prêt (€)")
    duration: int = Field(..., ge=1, le=30, description="Durée en années")
    interestRate: float = Field(..., ge=0, le=20, description="Taux d'intérêt annuel (%)")
    insuranceRate: float = Field(..., ge=0, le=5, description="Taux d'assurance annuel (%)")
    downPayment: float = Field(..., ge=0, description="Apport (€)")
    notaryFees: float = Field(..., ge=0, le=100, description="Frais de notaire (%)")
    agencyFees: float = Field(..., ge=0, le=100, description="Frais d'agence (%)")
    propertyValue: float = Field(..., gt=0, description="Valeur du bien (€)")
    monthlyIncome: Union[float, None] = Field(None, ge=0, description="Revenus mensuels (€)")
    monthlyCharges: Union[float, None] = Field(None, ge=0, description="Charges mensuelles (€)")
    travaux: Union[float, None] = Field(None, ge=0, description="Travaux (€)")
    revalorisationBien: Union[float, None] = Field(None, ge=-10, le=20, description="Révalorisation annuelle du bien (%)")

class SimulationRequest(BaseModel):
    parameters: SimulationParameters

class AmortizationEntry(BaseModel):
    period: int
    date: str
    payment: float
    principal: float
    interest: float
    balance: float

class PropertyEvolutionEntry(BaseModel):
    year: int
    value: float
    remainingCapital: float
    netEquity: float

class SimulationResults(BaseModel):
    monthlyPayment: float
    totalInterest: float
    totalInsurance: float
    totalCost: float
    amortizationTable: List[AmortizationEntry]
    propertyValueEvolution: List[PropertyEvolutionEntry]
    salaryRequirement: float

class SimulationResponse(BaseModel):
    success: bool
    results: Union[SimulationResults, None]
    error: Union[str, None]

# Fonction de calcul principale (adaptée de votre code existant)
def calculate_simulation(params: SimulationParameters) -> SimulationResults:
    try:
        # Paramètres d'entrée
        N = params.duration  # Durée en années
        C2 = params.loanAmount  # Montant du prêt
        T = params.interestRate  # Taux d'intérêt
        ASSU = params.insuranceRate  # Taux d'assurance
        apport = params.downPayment  # Apport
        fraisNotaire = params.notaryFees  # Frais de notaire (%)
        fraisAgence = params.agencyFees  # Frais d'agence (%)
        TRAVAUX = params.travaux or 0  # Travaux
        revalorisationBien = params.revalorisationBien or 0  # Révalorisation du bien

        # Calculs préparatoires
        CDEPART = C2
        fraisAgence2 = (fraisAgence / 100) * C2
        fraisNotaire_amount = (fraisNotaire / 100) * C2
        C2 = C2 - apport
        garantieBancaire = (1.5 / 100) * C2

        # Assurer que les frais sont positifs
        garantieBancaire = max(0, garantieBancaire)
        fraisAgence2 = max(0, fraisAgence2)

        # Montant total à financer
        C2 = C2 + fraisNotaire_amount + garantieBancaire + fraisAgence2 + TRAVAUX

        # Durée en mois
        N_months = N * 12

        # Calcul de la mensualité
        t = T / 12  # Taux mensuel
        q = 1 + t / 100  # Coefficient multiplicateur

        if q ** N_months != 1:
            M = (q ** N_months * C2 * (1 - q) / (1 - q ** N_months)) + C2 * ((ASSU / 100) / 12)
        else:
            M = C2 / N_months + C2 * ((ASSU / 100) / 12)

        # Calcul du tableau d'amortissement
        T2 = T / 100  # Taux annuel décimal

        # Générer les dates
        start_date = datetime.datetime.now().replace(day=1)
        dates = pd.date_range(start=start_date, periods=N_months, freq='MS')

        # Créer le DataFrame d'amortissement
        df = pd.DataFrame(index=dates, columns=['Mensualité', 'Capital Amorti', 'Intérêts', 'Capital restant dû'], dtype='float64')
        df.reset_index(inplace=True)
        df.index += 1
        df.index.name = "Mois"
        df.columns = ['Date', 'Mensualité', 'Capital Amorti', 'Intérêts', 'Capital restant dû']

        # Calculs avec numpy_financial
        if N_months > 0 and C2 > 0:
            df["Mensualité"] = (-1 * numpy_financial.pmt(T2/12, N_months, C2) + C2 * ((ASSU/100)/12)).astype('float64')
            df["Capital Amorti"] = (-1 * numpy_financial.ppmt(T2/12, df.index, N_months, C2)).astype('float64')
            df["Intérêts"] = (-1 * numpy_financial.ipmt(T2/12, df.index, N_months, C2)).astype('float64')

        df = df.round(2)

        # Calcul du capital restant dû
        df["Capital restant dû"] = 0.0
        if len(df) > 0:
            df.loc[1, "Capital restant dû"] = C2 - df.loc[1, "Capital Amorti"]

        for period in range(2, len(df) + 1):
            previous_balance = df.loc[period - 1, "Capital restant dû"]
            principal_paid = df.loc[period, "Capital Amorti"]
            if previous_balance > 0:
                df.loc[period, "Capital restant dû"] = previous_balance - principal_paid

        # Calcul de l'évolution de la valeur du bien
        property_evolution = []
        current_value = CDEPART

        for year in range(N + 1):
            remaining_capital = 0
            if year * 12 < len(df):
                remaining_capital = df.loc[min(year * 12 + 1, len(df)), "Capital restant dû"]

            property_evolution.append({
                "year": year,
                "value": round(current_value, 2),
                "remainingCapital": round(remaining_capital, 2),
                "netEquity": round(current_value - remaining_capital, 2)
            })

            current_value *= (1 + revalorisationBien / 100)

        # Calcul du salaire minimum requis
        salary_requirement = M * 100 / 35 if M > 0 else 0

        # Préparer le tableau d'amortissement pour la réponse
        amortization_table = []
        for idx, row in df.iterrows():
            amortization_table.append({
                "period": int(idx),
                "date": row['Date'].strftime('%Y-%m-%d'),
                "payment": float(row['Mensualité']),
                "principal": float(row['Capital Amorti']),
                "interest": float(row['Intérêts']),
                "balance": float(row['Capital restant dû'])
            })

        # Calculs finaux
        total_interest = float(df['Intérêts'].sum())
        total_insurance = float(C2 * (ASSU / 100) * (N / 12))
        total_cost = float(M * N_months)

        return SimulationResults(
            monthlyPayment=round(M, 2),
            totalInterest=round(total_interest, 2),
            totalInsurance=round(total_insurance, 2),
            totalCost=round(total_cost, 2),
            amortizationTable=amortization_table,
            propertyValueEvolution=property_evolution,
            salaryRequirement=round(salary_requirement, 2)
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur lors du calcul: {str(e)}")

# Routes API
@app.get("/")
def read_root():
    return {
        "message": "Simulio Simulation API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.datetime.now().isoformat()}

@app.post("/simulate", response_model=SimulationResponse)
def simulate_loan(request: SimulationRequest):
    try:
        results = calculate_simulation(request.parameters)
        return SimulationResponse(success=True, results=results, error=None)
    except Exception as e:
        return SimulationResponse(success=False, results=None, error=str(e))

@app.get("/test")
def test_calculation():
    """Route de test avec des paramètres par défaut"""
    test_params = SimulationParameters(
        loanAmount=200000,
        duration=25,
        interestRate=4.0,
        insuranceRate=0.3,
        downPayment=0,
        notaryFees=2.5,
        agencyFees=3.0,
        propertyValue=200000,
        travaux=0,
        revalorisationBien=1.0
    )

    try:
        results = calculate_simulation(test_params)
        return SimulationResponse(success=True, results=results, error=None)
    except Exception as e:
        return SimulationResponse(success=False, results=None, error=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)