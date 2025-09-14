<template>
  <div class="p-4">
    <div>
      <div class="mb-6">
        <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
              {{ simulation?.name || 'Simulation' }}
            </h1>
            <p class="mt-1 text-gray-600">
              Détails et résultats de la simulation
            </p>
          </div>
          <div class="flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
            <router-link
              to="/simulations"
              class="inline-flex text-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              ← 
            </router-link>
            <Button
              @click="openEditModal"
              variant="outline"
            >
              {{ authStore.role === 'client' ? 'Modifier les paramètres' : 'Modifier les paramètres' }}
            </Button>
            <Button
              v-if="simulation?.status === 'completed'"
              @click="exportResults"
              class="hidden"
            >
              Exporter
            </Button>
          </div>
        </div>
      </div>

      <div class="relative mb-6">
        <div class="flex items-center justify-between mb-4 lg:hidden">
          <button
            @click="previousInfoSlide"
            class="p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
            :class="{ 'opacity-50 cursor-not-allowed': currentInfoSlide === 0 }"
          >
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div class="flex space-x-2">
            <div
              v-for="(slide, index) in infoSlides"
              :key="index"
              class="w-2 h-2 rounded-full transition-colors"
              :class="currentInfoSlide === index ? 'bg-indigo-600' : 'bg-gray-300'"
            ></div>
          </div>
          <button
            @click="nextInfoSlide"
            class="p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
            :class="{ 'opacity-50 cursor-not-allowed': currentInfoSlide === infoSlides.length - 1 }"
          >
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-300 ease-in-out lg:grid lg:grid-cols-3 lg:gap-4"
            :style="{ transform: `translateX(-${currentInfoSlide * 100}%)` }"
          >
            <div class="w-full flex-shrink-0 lg:w-auto">
              <Card class="p-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 rounded-full flex items-center justify-center"
                    :class="{
                      'bg-yellow-100': simulation?.status === 'processing',
                      'bg-green-100': simulation?.status === 'completed',
                      'bg-red-100': simulation?.status === 'failed',
                      'bg-gray-100': simulation?.status === 'pending'
                    }"
                  >
                    <div
                      class="w-6 h-6 rounded-full"
                      :class="{
                        'bg-yellow-500': simulation?.status === 'processing',
                        'bg-green-500': simulation?.status === 'completed',
                        'bg-red-500': simulation?.status === 'failed',
                        'bg-gray-500': simulation?.status === 'pending'
                      }"
                    ></div>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      {{ getStatusLabel(simulation?.status) }}
                    </h3>
                    <p class="text-sm text-gray-600">
                      Statut de la simulation
                    </p>
                    <div v-if="simulation?.status === 'processing'" class="flex items-center space-x-2 mt-2">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      <span class="text-sm text-gray-600">Calcul en cours...</span>
                    </div>
                    <div v-if="simulation?.status === 'failed'" class="mt-2">
                      <Button
                        @click="retrySimulation"
                        size="sm"
                        class="bg-red-600 hover:bg-red-700"
                      >
                        Réessayer
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div class="w-full flex-shrink-0 lg:w-auto">
              <Card class="p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">Client</h3>
                      <div v-if="simulation?.client" class="mt-1">
                        <p class="text-sm font-medium text-gray-900">{{ simulation.client.fullName }}</p>
                        <p class="text-xs text-gray-500">{{ simulation.client.email }}</p>
                      </div>
                      <div v-else class="mt-1">
                        <p class="text-sm text-gray-500">Aucun client assigné</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    v-if="!simulation?.client && (authStore.isAdmin || authStore.isAgent)"
                    @click="openClientModal"
                    variant="outline"
                    size="sm"
                  >
                    Assigner
                  </Button>
                </div>
              </Card>
            </div>

            <div class="w-full flex-shrink-0 lg:w-auto">
              <Card class="p-4">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Création</h3>
                    <p class="text-sm text-gray-600">
                      {{ formatDate(simulation?.createdAt) }}
                    </p>
                    <p class="hidden text-xs text-gray-500">
                      Par {{ simulation?.createdBy?.fullName }}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <Card class="p-4 bg-gradient-to-br from-slate-50 to-blue-50 border-0 shadow-lg">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900">
                Paramètres de la simulation
              </h3>
            </div>

            <div class="flex items-center justify-between mb-3 lg:hidden">
              <button
                @click="previousParamSlide"
                class="p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                :class="{ 'opacity-50 cursor-not-allowed': currentParamSlide === 0 }"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <div class="flex space-x-2">
                <div
                  v-for="(slide, index) in paramSlides"
                  :key="index"
                  class="w-2 h-2 rounded-full transition-colors"
                  :class="currentParamSlide === index ? 'bg-indigo-600' : 'bg-gray-300'"
                ></div>
              </div>
              <button
                @click="nextParamSlide"
                class="p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                :class="{ 'opacity-50 cursor-not-allowed': currentParamSlide === paramSlides.length - 1 }"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <!-- Contenu des slides -->
            <div class="overflow-hidden">
              <div
                class="flex transition-transform duration-300 ease-in-out lg:grid lg:grid-cols-1 lg:gap-3"
                :style="{ transform: `translateX(-${currentParamSlide * 100}%)` }"
              >
                <!-- Montant du prêt -->
                <div class="w-full flex-shrink-0 lg:w-auto">
                  <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-blue-200">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <dt class="text-sm font-medium text-gray-500 mb-1">Montant du prêt</dt>
                        <dd class="text-lg font-bold text-gray-900">
                          {{ formatCurrency(simulation?.parameters?.loanAmount) }}
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Durée -->
                <div class="w-full flex-shrink-0 lg:w-auto">
                  <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-blue-200">
                    <div class="flex items-center space-x-3">
                      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <dt class="text-sm font-medium text-gray-500 mb-1">Durée</dt>
                        <dd class="text-base font-bold text-gray-900">
                          {{ simulation?.parameters?.duration }} ans
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Taux d'intérêt -->
                <div class="w-full flex-shrink-0 lg:w-auto">
                  <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-blue-200">
                    <div class="flex items-center space-x-3">
                      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <dt class="text-sm font-medium text-gray-500 mb-1">Taux d'intérêt</dt>
                        <dd class="text-base font-bold text-gray-900">
                          {{ simulation?.parameters?.interestRate }}%
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Taux d'assurance -->
                <div class="w-full flex-shrink-0 lg:w-auto">
                  <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-blue-200">
                    <div class="flex items-center space-x-3">
                      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <dt class="text-sm font-medium text-gray-500 mb-1">Taux d'assurance</dt>
                        <dd class="text-base font-bold text-gray-900">
                          {{ simulation?.parameters?.insuranceRate }}%
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Apport -->
                <div class="w-full flex-shrink-0 lg:w-auto">
                  <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-blue-200">
                    <div class="flex items-center space-x-3">
                      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <dt class="text-sm font-medium text-gray-500 mb-1">Apport</dt>
                        <dd class="text-base font-bold text-gray-900">
                          {{ formatCurrency(simulation?.parameters?.downPayment) }}
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Frais de notaire -->
                <div class="w-full flex-shrink-0 lg:w-auto">
                  <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-blue-200">
                    <div class="flex items-center space-x-3">
                      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <dt class="text-sm font-medium text-gray-500 mb-1">Frais de notaire</dt>
                        <dd class="text-base font-bold text-gray-900">
                          {{ simulation?.parameters?.notaryFees }}%
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Frais d'agence -->
                <div class="w-full flex-shrink-0 lg:w-auto">
                  <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-blue-200">
                    <div class="flex items-center space-x-3">
                      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <dt class="text-sm font-medium text-gray-500 mb-1">Frais d'agence</dt>
                        <dd class="text-base font-bold text-gray-900">
                          {{ simulation?.parameters?.agencyFees }}%
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Résultats -->
        <div class="lg:col-span-2">
          <div v-if="simulation?.status === 'completed' && simulation.results">
            <!-- Résultat principal -->
            <Card class="p-4 mb-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
              <div class="text-center">
                <h3 class="text-base font-semibold text-gray-900 mb-1">
                  Mensualité
                </h3>
                <div class="text-3xl font-bold text-indigo-600 mb-1">
                  {{ formatCurrency(simulation.results.monthlyPayment) }}
                </div>
                <p class="text-xs text-gray-600">
                  Paiement mensuel (capital + intérêts + assurance)
                </p>
              </div>
            </Card>

            <!-- Autres résultats -->
            <div class="relative">
              <!-- Navigation des slides (visible sur mobile uniquement) -->
              <div class="flex items-center justify-between mb-3 md:hidden">
                <button
                  @click="previousResultSlide"
                  class="p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                  :class="{ 'opacity-50 cursor-not-allowed': currentResultSlide === 0 }"
                >
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <div class="flex space-x-2">
                  <div
                    v-for="(slide, index) in resultSlides"
                    :key="index"
                    class="w-2 h-2 rounded-full transition-colors"
                    :class="currentResultSlide === index ? 'bg-indigo-600' : 'bg-gray-300'"
                  ></div>
                </div>
                <button
                  @click="nextResultSlide"
                  class="p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                  :class="{ 'opacity-50 cursor-not-allowed': currentResultSlide === resultSlides.length - 1 }"
                >
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>

              <!-- Contenu des slides -->
              <div class="overflow-hidden">
                <div
                  class="flex transition-transform duration-300 ease-in-out md:grid md:grid-cols-3 md:gap-3"
                  :style="{ transform: `translateX(-${currentResultSlide * 100}%)` }"
                >
                  <!-- Coût total -->
                  <div class="w-full flex-shrink-0 md:w-auto">
                    <Card class="p-3 text-center">
                      <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                      </div>
                      <div class="text-lg font-bold text-green-600">
                        {{ formatCurrency(simulation.results.totalCost) }}
                      </div>
                      <div class="text-xs text-gray-500 mt-1">Coût total</div>
                    </Card>
                  </div>

                  <!-- Intérêts totaux -->
                  <div class="w-full flex-shrink-0 md:w-auto">
                    <Card class="p-3 text-center">
                      <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-red-100 flex items-center justify-center">
                        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                        </svg>
                      </div>
                      <div class="text-lg font-bold text-red-600">
                        {{ formatCurrency(simulation.results.totalInterest) }}
                      </div>
                      <div class="text-xs text-gray-500 mt-1">Intérêts totaux</div>
                    </Card>
                  </div>

                  <!-- Salaire requis -->
                  <div class="w-full flex-shrink-0 md:w-auto">
                    <Card class="p-3 text-center">
                      <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </div>
                      <div class="text-lg font-bold text-blue-600">
                        {{ formatCurrency(simulation.results.salaryRequirement) }}
                      </div>
                      <div class="text-xs text-gray-500 mt-1">Salaire requis</div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            <Card v-if="showAmortizationTable" class="p-4 mt-4">
              <div class="flex items-center justify-between mb-3 mt-4">
                <h3 class="text-base font-medium text-gray-900">
                  Tableau d'amortissement
                </h3>
                <Button
                  @click="showAmortizationTable = false"
                  variant="outline"
                  size="sm"
                >
                  Masquer
                </Button>
              </div>

              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Période
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mensualité
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capital
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Intérêts
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restant dû
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="entry in paginatedAmortizationTable"
                      :key="entry.period"
                    >
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ entry.period }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatDate(entry.date) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatCurrency(entry.payment) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatCurrency(entry.principal) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatCurrency(entry.interest) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatCurrency(entry.balance) }}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Pagination -->
                <div v-if="totalAmortizationPages > 1" class="flex items-center justify-between mt-3">
                  <div class="text-sm text-gray-500">
                    Affichage de {{ (currentAmortizationPage - 1) * itemsPerPage + 1 }} à 
                    {{ Math.min(currentAmortizationPage * itemsPerPage, simulation.results.amortizationTable.length) }} 
                    sur {{ simulation.results.amortizationTable.length }} entrées
                  </div>
                  <div class="flex space-x-2">
                    <Button
                      @click="currentAmortizationPage--"
                      :disabled="currentAmortizationPage === 1"
                      variant="outline"
                      size="sm"
                    >
                      Précédent
                    </Button>
                    <span class="px-3 py-1 text-sm text-gray-700">
                      Page {{ currentAmortizationPage }} sur {{ totalAmortizationPages }}
                    </span>
                    <Button
                      @click="currentAmortizationPage++"
                      :disabled="currentAmortizationPage === totalAmortizationPages"
                      variant="outline"
                      size="sm"
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card v-else class="p-4 text-center mt-4">
              <h3 class="text-base font-medium text-gray-900 mb-2">
                Tableau d'amortissement
              </h3>
              <p class="text-sm text-gray-500 mb-3">
                Consultez le détail mensuel de votre remboursement
              </p>
              <Button
                @click="showAmortizationTable = true"
                variant="outline"
              >
                Afficher le tableau d'amortissement
              </Button>
            </Card>
          </div>

          <Card v-else-if="simulation?.status === 'failed'" class="p-4">
            <div class="text-center">
              <svg class="mx-auto h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Erreur de calcul</h3>
              <p class="mt-1 text-sm text-gray-500">
                Une erreur s'est produite lors du calcul de la simulation.
              </p>
              <div class="mt-4">
                <Button @click="retrySimulation">
                  Réessayer
                </Button>
              </div>
            </div>
          </Card>

          <Card v-else class="p-4">
            <div class="text-center">
              <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Simulation en cours</h3>
              <p class="mt-1 text-sm text-gray-500">
                Les résultats seront disponibles une fois le calcul terminé.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <!-- Modal de création de variante en cours -->
    <Modal
      :is-open="isCreatingVariant"
      title="Modification des paramètres en cours..."
      size="md"
      @close="() => {}"
    >
      <template #header>
        <h3 class="text-lg font-medium text-gray-900">
          Modification des paramètres en cours...
        </h3>
      </template>

      <div class="text-center py-6">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Calcul de votre simulation
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          Nous créons votre variante et effectuons les calculs financiers.
          Cela peut prendre quelques instants...
        </p>
        <div class="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <span>Calcul en cours...</span>
        </div>
      </div>
    </Modal>

    <Modal
      :is-open="showEditModal"
      :title="authStore.role === 'client' ? 'Modifier les paramètres' : 'Modifier les paramètres'"
      size="lg"
      @close="closeEditModal"
    >
      <div v-if="editParameters" class="space-y-6">
        <!-- Message explicatif pour les clients -->
        <div v-if="authStore.role === 'client'" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-blue-900">Modifier les paramètres</h4>
              <p class="mt-1 text-sm text-blue-700">
                Modifiez les paramètres pour créer une nouvelle simulation basée sur celle-ci.
                La simulation originale restera inchangée.
              </p>
            </div>
          </div>
        </div>

        <!-- Étape 1: Montant du prêt -->
          <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Montant du prêt</h4>
          <div class="max-w-md mx-auto">
            <PriceSlider
              v-model="editParameters.loanAmount"
              label="Montant du prêt"
              :min="50000"
              :max="1000000"
              :step="5000"
              :shortcuts="[
                { label: '100k€', value: 100000 },
                { label: '200k€', value: 200000 },
                { label: '300k€', value: 300000 },
                { label: '500k€', value: 500000 }
              ]"
            />
          </div>
          </div>

        <!-- Étape 2: Durée du prêt -->
          <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Durée du prêt</h4>
          <div class="max-w-md mx-auto">
            <div class="text-center mb-6">
              <div class="text-3xl font-bold text-indigo-600">
                {{ editParameters.duration }} ans
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Durée du prêt
              </div>
            </div>

            <input
              v-model.number="editParameters.duration"
              type="range"
              min="10"
              max="30"
              step="5"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />

            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>10 ans</span>
              <span>30 ans</span>
            </div>

            <div class="flex flex-wrap gap-2 justify-center mt-4">
              <button
                v-for="duration in [10, 15, 20, 25, 30]"
                :key="duration"
                @click="editParameters.duration = duration"
                :class="[
                  'px-3 py-1 text-xs rounded-full border transition-colors',
                  editParameters.duration === duration
                    ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                ]"
              >
                {{ duration }} ans
              </button>
            </div>
          </div>
          </div>

        <!-- Étape 3: Taux d'intérêt -->
          <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Taux d'intérêt</h4>
          <div class="max-w-md mx-auto">
            <div class="text-center mb-6">
              <div class="text-3xl font-bold text-indigo-600">
                {{ editParameters.interestRate }}%
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Taux d'intérêt annuel
              </div>
            </div>

            <input
              v-model.number="editParameters.interestRate"
              type="range"
              min="0.5"
              max="6"
              step="0.1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />

            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>0.5%</span>
              <span>6%</span>
          </div>

            <div class="flex flex-wrap gap-2 justify-center mt-4">
              <button
                v-for="rate in [1.5, 2.0, 2.5, 3.0, 3.5, 4.0]"
                :key="rate"
                @click="editParameters.interestRate = rate"
                :class="[
                  'px-3 py-1 text-xs rounded-full border transition-colors',
                  editParameters.interestRate === rate
                    ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                ]"
              >
                {{ rate }}%
              </button>
            </div>
          </div>
        </div>

        <!-- Étape 4: Taux d'assurance -->
          <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Taux d'assurance</h4>
          <div class="max-w-md mx-auto">
            <div class="text-center mb-6">
              <div class="text-3xl font-bold text-indigo-600">
                {{ editParameters.insuranceRate }}%
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Taux d'assurance annuel
              </div>
            </div>

            <input
              v-model.number="editParameters.insuranceRate"
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />

            <div class="flex justify-between text-xs text-gray-400 mt-2">
              <span>0%</span>
              <span>1.5%</span>
            </div>

            <div class="flex flex-wrap gap-2 justify-center mt-4">
              <button
                v-for="rate in [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]"
                :key="rate"
                @click="editParameters.insuranceRate = rate"
                :class="[
                  'px-3 py-1 text-xs rounded-full border transition-colors',
                  editParameters.insuranceRate === rate
                    ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                ]"
              >
                {{ rate }}%
              </button>
            </div>
          </div>
        </div>

        <!-- Étape 5: Apport personnel -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Apport personnel</h4>
          <div class="max-w-md mx-auto">
            <PriceSlider
              v-model="editParameters.downPayment"
              label="Apport personnel"
              :min="0"
              :max="Math.floor(editParameters.loanAmount * 0.5)"
              :step="1000"
              :shortcuts="[
                { label: '0€', value: 0 },
                { label: '10%', value: Math.floor(editParameters.loanAmount * 0.1) },
                { label: '20%', value: Math.floor(editParameters.loanAmount * 0.2) },
                { label: '30%', value: Math.floor(editParameters.loanAmount * 0.3) }
              ]"
            />
          </div>
        </div>

        <!-- Étape 6: Valeur du bien -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Valeur du bien</h4>
          <div class="max-w-md mx-auto">
            <PriceSlider
              v-model="editParameters.propertyValue"
              label="Valeur du bien"
              :min="100000"
              :max="2000000"
              :step="10000"
              :shortcuts="[
                { label: '200k€', value: 200000 },
                { label: '300k€', value: 300000 },
                { label: '500k€', value: 500000 },
                { label: '750k€', value: 750000 },
                { label: '1M€', value: 1000000 }
              ]"
            />
          </div>
        </div>

        <!-- Étape 7: Frais associés -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-6 text-center">Frais associés</h4>
          <div class="max-w-md mx-auto space-y-6">
            <!-- Frais de notaire -->
            <div>
              <div class="text-center mb-4">
                <div class="text-2xl font-bold text-indigo-600">
                  {{ editParameters.notaryFees }}%
                </div>
                <div class="text-sm text-gray-500">
                  Frais de notaire
                </div>
              </div>

              <input
                v-model.number="editParameters.notaryFees"
                type="range"
                min="1"
                max="8"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />

              <div class="flex justify-between text-xs text-gray-400 mt-2">
                <span>1%</span>
                <span>8%</span>
              </div>

              <div class="flex flex-wrap gap-2 justify-center mt-2">
                <button
                  v-for="fee in [2.0, 2.5, 3.0, 3.5, 4.0]"
                  :key="fee"
                  @click="editParameters.notaryFees = fee"
                  :class="[
                    'px-2 py-1 text-xs rounded-full border transition-colors',
                    editParameters.notaryFees === fee
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  ]"
                >
                  {{ fee }}%
                </button>
              </div>
            </div>

            <!-- Frais d'agence -->
            <div>
              <div class="text-center mb-4">
                <div class="text-2xl font-bold text-green-600">
                  {{ editParameters.agencyFees }}%
                </div>
                <div class="text-sm text-gray-500">
                  Frais d'agence
                </div>
              </div>

              <input
                v-model.number="editParameters.agencyFees"
                type="range"
                min="0"
                max="10"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />

              <div class="flex justify-between text-xs text-gray-400 mt-2">
                <span>0%</span>
                <span>10%</span>
              </div>

              <div class="flex flex-wrap gap-2 justify-center mt-2">
                <button
                  v-for="fee in [0, 2.0, 3.0, 4.0, 5.0]"
                  :key="fee"
                  @click="editParameters.agencyFees = fee"
                  :class="[
                    'px-2 py-1 text-xs rounded-full border transition-colors',
                    editParameters.agencyFees === fee
                      ? 'bg-green-100 border-green-300 text-green-700'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  ]"
                >
                  {{ fee }}%
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Étape 8: Options avancées -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-6 text-center">Options avancées</h4>
          <div class="max-w-md mx-auto space-y-6">
            <!-- Travaux -->
            <div>
              <PriceSlider
                v-model="editParameters.travaux"
                label="Montant des travaux"
                :min="0"
                :max="200000"
                :step="1000"
                :shortcuts="[
                  { label: '0€', value: 0 },
                  { label: '10k€', value: 10000 },
                  { label: '25k€', value: 25000 },
                  { label: '50k€', value: 50000 },
                  { label: '100k€', value: 100000 }
                ]"
              />
            </div>

            <!-- Revalorisation du bien -->
            <div>
              <div class="text-center mb-4">
                <div class="text-2xl font-bold text-purple-600">
                  {{ editParameters.revalorisationBien }}%
                </div>
                <div class="text-sm text-gray-500">
                  Revalorisation annuelle du bien
                </div>
              </div>

              <input
                v-model.number="editParameters.revalorisationBien"
                type="range"
                min="-2"
                max="5"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />

              <div class="flex justify-between text-xs text-gray-400 mt-2">
                <span>-2%</span>
                <span>5%</span>
              </div>

              <div class="flex flex-wrap gap-2 justify-center mt-2">
                <button
                  v-for="rate in [0, 0.5, 1.0, 1.5, 2.0, 2.5]"
                  :key="rate"
                  @click="editParameters.revalorisationBien = rate"
                  :class="[
                    'px-2 py-1 text-xs rounded-full border transition-colors',
                    editParameters.revalorisationBien === rate
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  ]"
                >
                  {{ rate }}%
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button
            @click="closeEditModal"
            variant="outline"
          >
            Annuler
          </Button>
          <Button
            @click="saveParameters"
            :disabled="isUpdating"
          >
            <span v-if="isUpdating">{{ authStore.role === 'client' ? 'Création en cours...' : 'Mise à jour...' }}</span>
            <span v-else>{{ authStore.role === 'client' ? 'Recalculer' : 'Sauvegarder et recalculer' }}</span>
          </Button>
        </div>
      </template>
    </Modal>

    <Modal
      :is-open="showClientModal"
      title="Assigner un client"
      size="md"
      @close="closeClientModal"
    >
      <div class="space-y-3">
        <div v-if="clients && clients.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Choisir un client existant
          </label>
          <select
            v-model="selectedClientId"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Sélectionner un client</option>
            <option
              v-for="client in clients"
              :key="client.id"
              :value="client.id"
            >
              {{ client.fullName }} - {{ client.email }}
            </option>
          </select>
        </div>
        
        <div v-else class="text-center py-3">
          <p class="text-sm text-gray-500 mb-3">
            Aucun client disponible pour l'assignation
          </p>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-500 mb-1">ou</p>
          <Button
            @click="openCreateClientModal"
            variant="outline"
          >
            Créer un nouveau client
          </Button>
        </div>
        
        <div v-if="assignmentError" class="rounded-md bg-red-50 p-3">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ assignmentError }}</p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button
            @click="closeClientModal"
            variant="outline"
          >
            Annuler
          </Button>
          <Button
            @click="assignClient"
            :disabled="!selectedClientId || isAssigningClient"
          >
            <span v-if="isAssigningClient">Attribution...</span>
            <span v-else>Assigner</span>
          </Button>
        </div>
      </template>
    </Modal>

    <CreateClientModal
      :is-open="showCreateClientModal"
      @close="closeCreateClientModal"
      @client-created="handleClientCreated"
    />

    <ClientCredentialsModal
      :is-open="showCredentialsModal"
      :client="createdClient"
      :generated-password="generatedPassword"
      @close="closeCredentialsModal"
      @password-regenerated="handlePasswordRegenerated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSimulationStore } from '@/stores/simulation'
import { useClientStore } from '@/stores/client'
import { useAuthStore } from '@/stores/auth'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import PriceSlider from '@/components/ui/PriceSlider.vue'
import CreateClientModal from '@/components/ui/CreateClientModal.vue'
import ClientCredentialsModal from '@/components/ui/ClientCredentialsModal.vue'
import type { SimulationParameters } from '@/types'

const route = useRoute()
const router = useRouter()
const simulationStore = useSimulationStore()
const clientStore = useClientStore()
const authStore = useAuthStore()

const showAmortizationTable = ref(false)
const currentAmortizationPage = ref(1)
const itemsPerPage = ref(12)
const pollingInterval = ref(null)

const currentInfoSlide = ref(0)
const currentResultSlide = ref(0)
const currentParamSlide = ref(0)
const infoSlides = [0, 1, 2]
const resultSlides = [0, 1, 2]
const paramSlides = [0, 1, 2, 3, 4, 5, 6]

const showEditModal = ref(false)
const showClientModal = ref(false)
const showCreateClientModal = ref(false)
const showCredentialsModal = ref(false)
const editParameters = ref<SimulationParameters | null>(null)
const selectedClientId = ref<string | number>('')
const isUpdating = ref(false)
const isAssigningClient = ref(false)
const assignmentError = ref('')
const createdClient = ref<any>(null)
const generatedPassword = ref('')
const isCreatingVariant = ref(false)
const newSimulationId = ref<number | null>(null)

const simulation = computed(() => simulationStore.currentSimulation)
const clients = computed(() => clientStore.clients)

const paginatedAmortizationTable = computed(() => {
  if (!simulation.value?.results?.amortizationTable) return []
  
  const start = (currentAmortizationPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return simulation.value.results.amortizationTable.slice(start, end)
})

const totalAmortizationPages = computed(() => {
  if (!simulation.value?.results?.amortizationTable) return 0
  return Math.ceil(simulation.value.results.amortizationTable.length / itemsPerPage.value)
})

const startPolling = () => {
  if (pollingInterval.value) return
  
  pollingInterval.value = setInterval(async () => {
    const simulationId = route.params.id as string
    if (simulation.value?.status === 'processing' || simulation.value?.status === 'pending') {
      try {
        await simulationStore.fetchSimulation(parseInt(simulationId))
      } catch (error) {
        console.error('Erreur lors du polling:', error)
      }
    } else {
      stopPolling()
    }
  }, 2000)
}

const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

const startPollingForNewSimulation = async (simulationId: number) => {
  return new Promise<void>((resolve) => {
    const pollInterval = setInterval(async () => {
      try {
        const updatedSimulation = await simulationStore.fetchSimulation(simulationId)

        if (updatedSimulation.status === 'completed') {
          clearInterval(pollInterval)
          isCreatingVariant.value = false
          newSimulationId.value = null
          await router.push(`/simulations/${simulationId}`)
          resolve()
        } else if (updatedSimulation.status === 'failed') {
          clearInterval(pollInterval)
          isCreatingVariant.value = false
          newSimulationId.value = null
          console.error('La simulation a échoué')
          resolve()
        }
      } catch (error) {
        console.error('Erreur lors du polling de la nouvelle simulation:', error)
        clearInterval(pollInterval)
        isCreatingVariant.value = false
        newSimulationId.value = null
        resolve()
      }
    }, 2000)
  })
}

onMounted(async () => {
  const simulationId = route.params.id as string
  try {
    await simulationStore.fetchSimulation(parseInt(simulationId))
    
      await clientStore.fetchClients()
    
    if (simulation.value?.status === 'processing' || simulation.value?.status === 'pending') {
      startPolling()
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la simulation:', error)
  }
})

onUnmounted(() => {
  stopPolling()
  isCreatingVariant.value = false
  newSimulationId.value = null
})

const openEditModal = () => {
  if (simulation.value?.parameters) {
    editParameters.value = { ...simulation.value.parameters }
    showEditModal.value = true
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editParameters.value = null
}

const saveParameters = async () => {
  if (!editParameters.value || !simulation.value) return
  
  isUpdating.value = true
  try {
    if (authStore.role === 'client') {
      isCreatingVariant.value = true

      const newSimulationName = `${simulation.value.name} - Variante`
      const newSimulationData = {
        name: newSimulationName,
        parameters: editParameters.value,
        clientId: simulation.value.clientId
      }

      const newSimulation = await simulationStore.createSimulation(newSimulationData)
      newSimulationId.value = newSimulation.id

      closeEditModal()

      await startPollingForNewSimulation(newSimulation.id)

    } else {
    await simulationStore.updateSimulation(
      simulation.value.id,
      { parameters: editParameters.value }
    )
    closeEditModal()
    if (simulation.value?.status === 'processing' || simulation.value?.status === 'pending') {
      startPolling()
      }
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    isCreatingVariant.value = false
    newSimulationId.value = null
  } finally {
    isUpdating.value = false
  }
}

const openClientModal = () => {
  selectedClientId.value = ''
  assignmentError.value = ''
  showClientModal.value = true
}

const closeClientModal = () => {
  showClientModal.value = false
  selectedClientId.value = ''
}

const assignClient = async () => {
  if (!selectedClientId.value || !simulation.value) {
    return
  }
  
  isAssigningClient.value = true
  try {
    const clientId = typeof selectedClientId.value === 'string' 
      ? parseInt(selectedClientId.value) 
      : selectedClientId.value
    
    await simulationStore.updateSimulation(
      simulation.value.id,
      { clientId }
    )
    
    closeClientModal()
  } catch (error) {
    console.error('Erreur lors de l\'assignation:', error)
    assignmentError.value = error.response?.data?.message || error.message || 'Erreur lors de l\'assignation du client'
  } finally {
    isAssigningClient.value = false
  }
}

const openCreateClientModal = () => {
  closeClientModal()
  showCreateClientModal.value = true
}

const closeCreateClientModal = () => {
  showCreateClientModal.value = false
}

const handleClientCreated = (newClient: any) => {
  createdClient.value = newClient
  generatedPassword.value = newClient.generatedPassword || ''

  showCreateClientModal.value = false

  showCredentialsModal.value = true
}

const closeCredentialsModal = () => {
  showCredentialsModal.value = false
  createdClient.value = null
  generatedPassword.value = ''

  if (createdClient.value) {
    selectedClientId.value = createdClient.value.id.toString()
    showClientModal.value = true
  }
}

const handlePasswordRegenerated = (newPassword: string) => {
  generatedPassword.value = newPassword
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const getStatusLabel = (status: string) => {
  const labels = {
    pending: 'En attente',
    processing: 'En cours',
    completed: 'Terminée',
    failed: 'Échouée',
  }
  return labels[status as keyof typeof labels] || status
}

const exportResults = () => {
  console.log('Export des résultats')
}

const retrySimulation = async () => {
  if (!simulation.value) return

  try {
    const updatedSimulation = await simulationStore.updateSimulation(
      simulation.value.id,
      { parameters: simulation.value.parameters }
    )
    simulation.value = updatedSimulation
  } catch (error) {
    console.error('Erreur lors du retry:', error)
  }
}

const nextInfoSlide = () => {
  if (currentInfoSlide.value < infoSlides.length - 1) {
    currentInfoSlide.value++
  }
}

const previousInfoSlide = () => {
  if (currentInfoSlide.value > 0) {
    currentInfoSlide.value--
  }
}

const nextResultSlide = () => {
  if (currentResultSlide.value < resultSlides.length - 1) {
    currentResultSlide.value++
  }
}

const previousResultSlide = () => {
  if (currentResultSlide.value > 0) {
    currentResultSlide.value--
  }
}

const nextParamSlide = () => {
  if (currentParamSlide.value < paramSlides.length - 1) {
    currentParamSlide.value++
  }
}

const previousParamSlide = () => {
  if (currentParamSlide.value > 0) {
    currentParamSlide.value--
  }
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-webkit-slider-track {
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
}

.slider::-moz-range-track {
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
}
</style>
