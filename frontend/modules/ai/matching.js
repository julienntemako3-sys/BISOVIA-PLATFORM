
/**
 * BISOVIA AI — Matching Module
 * Path: frontend/modules/ai/matching.js
 *
 * Purpose:
 * Match users/requests with suitable service providers.
 *
 * This module does NOT:
 * - process Pi payments
 * - access the database directly
 * - authenticate users
 * - replace the BISOVIA Core
 *
 * It prepares matching logic that can later communicate
 * with the backend/Core API.
 */

(function () {
    "use strict";

    const BISOVIA_AI_MATCHING = {

        /**
         * Default matching weights.
         * Total = 100
         */
        weights: {
            service: 30,
            category: 20,
            location: 15,
            availability: 15,
            rating: 10,
            price: 10
        },

        /**
         * Normalize text for comparison.
         */
        normalize(value) {
            if (value === null || value === undefined) {
                return "";
            }

            return String(value)
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();
        },

        /**
         * Check whether two values match.
         */
        matches(valueA, valueB) {
            const a = this.normalize(valueA);
            const b = this.normalize(valueB);

            if (!a || !b) {
                return false;
            }

            return a === b;
        },

        /**
         * Check whether a provider offers the requested service.
         */
        serviceMatch(request, provider) {
            if (!request || !provider) {
                return 0;
            }

            const requestedService = this.normalize(
                request.service || request.serviceType
            );

            if (!requestedService) {
                return 0;
            }

            const services = Array.isArray(provider.services)
                ? provider.services
                : [];

            return services.some(service => {
                if (typeof service === "string") {
                    return this.matches(service, requestedService);
                }

                return this.matches(
                    service.name || service.type || service.id,
                    requestedService
                );
            }) ? 1 : 0;
        },

        /**
         * Check category compatibility.
         */
        categoryMatch(request, provider) {
            if (!request || !provider) {
                return 0;
            }

            return this.matches(
                request.category,
                provider.category
            ) ? 1 : 0;
        },

        /**
         * Check location compatibility.
         */
        locationMatch(request, provider) {
            if (!request || !provider) {
                return 0;
            }

            const requestLocation = this.normalize(
                request.location ||
                request.city ||
                request.area
            );

            const providerLocation = this.normalize(
                provider.location ||
                provider.city ||
                provider.area
            );

            if (!requestLocation || !providerLocation) {
                return 0;
            }

            if (requestLocation === providerLocation) {
                return 1;
            }

            if (
                requestLocation.includes(providerLocation) ||
                providerLocation.includes(requestLocation)
            ) {
                return 0.7;
            }

            return 0;
        },

        /**
         * Check provider availability.
         */
        availabilityMatch(request, provider) {
            if (!request || !provider) {
                return 0;
            }

            if (provider.available === true) {
                return 1;
            }

            if (
                request.date &&
                Array.isArray(provider.availableDates)
            ) {
                return provider.availableDates.includes(
                    request.date
                ) ? 1 : 0;
            }

            return 0;
        },

        /**
         * Convert provider rating into a 0–1 score.
         */
        ratingMatch(provider) {
            if (!provider) {
                return 0;
            }

            const rating = Number(provider.rating);

            if (Number.isNaN(rating)) {
                return 0.5;
            }

            return Math.max(
                0,
                Math.min(rating / 5, 1)
            );
        },

        /**
         * Compare requested budget with provider price.
         */
        priceMatch(request, provider) {
            if (!request || !provider) {
                return 0.5;
            }

            const budget = Number(request.budget);
            const price = Number(provider.price);

            if (
                Number.isNaN(budget) ||
                Number.isNaN(price) ||
                budget <= 0
            ) {
                return 0.5;
            }

            if (price <= budget) {
                return 1;
            }

            const difference = (price - budget) / budget;

            if (difference <= 0.10) {
                return 0.8;
            }

            if (difference <= 0.25) {
                return 0.5;
            }

            return 0;
        },

        /**
         * Calculate complete matching score.
         */
        calculateScore(request, provider) {

            if (!request || !provider) {
                return {
                    score: 0,
                    percentage: 0,
                    details: {}
                };
            }

            const details = {
                service: this.serviceMatch(
                    request,
                    provider
                ),

                category: this.categoryMatch(
                    request,
                    provider
                ),

                location: this.locationMatch(
                    request,
                    provider
                ),

                availability: this.availabilityMatch(
                    request,
                    provider
                ),

                rating: this.ratingMatch(
                    provider
                ),

                price: this.priceMatch(
                    request,
                    provider
                )
            };

            let score = 0;

            Object.keys(this.weights).forEach(key => {
                score +=
                    details[key] *
                    this.weights[key];
            });

            return {
                score: Number(score.toFixed(2)),
                percentage: Number(score.toFixed(2)),
                details
            };
        },

        /**
         * Match one request against multiple providers.
         */
        findMatches(request, providers, options = {}) {

            if (!request || !Array.isArray(providers)) {
                return [];
            }

            const minimumScore =
                Number(options.minimumScore ?? 30);

            const limit =
                Number(options.limit ?? 10);

            const results = providers
                .map(provider => {

                    const result =
                        this.calculateScore(
                            request,
                            provider
                        );

                    return {
                        provider,
                        ...result
                    };
                })
                .filter(result =>
                    result.score >= minimumScore
                )
                .sort((a, b) =>
                    b.score - a.score
                )
                .slice(0, limit);

            return results;
        },

        /**
         * Return a simple explanation for a match.
         */
        explainMatch(result) {

            if (!result || !result.details) {
                return "No matching information available.";
            }

            const reasons = [];

            if (result.details.service === 1) {
                reasons.push(
                    "Service matches"
                );
            }

            if (result.details.category === 1) {
                reasons.push(
                    "Category matches"
                );
            }

            if (result.details.location > 0) {
                reasons.push(
                    "Location is compatible"
                );
            }

            if (result.details.availability === 1) {
                reasons.push(
                    "Provider is available"
                );
            }

            if (result.details.rating >= 0.8) {
                reasons.push(
                    "Strong provider rating"
                );
            }

            if (result.details.price === 1) {
                reasons.push(
                    "Price fits the requested budget"
                );
            }

            if (reasons.length === 0) {
                return "Limited compatibility found.";
            }

            return reasons.join(" • ");
        },

        /**
         * Prepare matching data for the BISOVIA Core/API.
         *
         * No API request is made here.
         */
        preparePayload(request, providers) {

            return {
                module: "ai",
                feature: "matching",
                request,
                providerIds: Array.isArray(providers)
                    ? providers.map(provider =>
                        provider.id
                    ).filter(Boolean)
                    : [],
                timestamp:
                    new Date().toISOString()
            };
        }
    };

    /**
     * Expose the module globally.
     */
    window.BISOVIA_AI_MATCHING =
        BISOVIA_AI_MATCHING;

})();
