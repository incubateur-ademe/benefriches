import type { ProjectDevelopmentScore } from "../development-score";

export const urbanProjectDevelopmentScoreMock = {
  score: {
    letterGradeWithModifiers: "C+",
    letterGrade: "C",
    gradePoints: 57,
  },
  details: {
    environmentScore: {
      score: {
        letterGradeWithModifiers: "C+",
        letterGrade: "C",
        gradePoints: 58,
      },
      indicators: {
        co2eqEmissionsVariation: {
          letterGrade: "E",
          role: "core",
          applies: true,
          gradePoints: 10,

          metrics: {
            avoidedCo2eqEmissions: 0,
            newStoredCo2Eq: -879.9999999999998,
            siteStatuQuoStoredCo2Eq: 2530,
            soilStoredPercentageVariation: -35,
          },
        },
        zanCompliance: {
          letterGrade: "A",
          role: "core",
          applies: true,
          gradePoints: 90,
          metrics: {
            permeableSurfaceDifference: {
              difference: 67500,
              percentVariation: 82,
            },
            newGreenSoilSurfaces: 0,
            siteReconversionType: "friche",
          },
        },
        soilsQuality: {
          letterGrade: "A",
          role: "core",
          applies: true,
          gradePoints: 90,
          metrics: {
            permeableSurfaceDifference: {
              difference: 67500,
              percentVariation: 82,
            },
            contamination: {
              siteContaminatedSurface: 0,
              difference: 0,
              percentVariation: 0,
            },
          },
        },
        waterQuality: {
          letterGrade: "C",
          role: "core",
          applies: true,
          gradePoints: 50,

          metrics: {
            contamination: {
              siteContaminatedSurface: 0,
              difference: 0,
              percentVariation: 0,
            },
            prairieSurfaceDifference: 0,
            forestSurfaceDifference: 0,
            agriculturalSurfaceDifference: 0,
            wetLandSurfaceDifference: 0,
          },
        },
        ecosystemServices: {
          letterGrade: "C",
          role: "core",
          applies: true,
          gradePoints: 50,

          metrics: {
            ecosystemicServices: [
              {
                detailsByYear: [],
                cumulativeByYear: [],
                total: -179342.48411330298,
                name: "newStoredCo2Eq",
              },
              {
                detailsByYear: [],
                cumulativeByYear: [],
                total: 46597.85325611531,
                name: "waterCycle",
              },
            ],
          },
        },
      },
    },
    fullTimeJobsScore: {
      score: {
        letterGradeWithModifiers: "C",
        letterGrade: "C",
        gradePoints: 50,
      },
      indicators: {
        fullTimeJobs: {
          letterGrade: "C",
          role: "core",
          applies: true,
          gradePoints: 90,

          metrics: {
            fullTimeJobsDifferenceByHectare: 0.02,
            siteSurfaceArea: 14500,
            siteStatuQuoFullTimeJobs: 0,
            difference: 0.238560832,
          },
        },
      },
    },
    localPeopleQualityOfLifeScore: {
      score: {
        letterGradeWithModifiers: "D",
        letterGrade: "D",
        gradePoints: 30,
      },
      indicators: {
        livingEnvironment: {
          letterGrade: "A",
          role: "core",
          applies: true,
          gradePoints: 90,

          metrics: {
            siteNature: "FRICHE",
            projectDevelopmentPlanType: "URBAN_PROJECT",
            siteReconversionType: "friche",
            buildingsFloorAreaDistribution: undefined,
            soilEvolutionDetails: { newGreenSoilSurfaces: 5400 },
          },
        },
        fricheAccidents: {
          letterGrade: "A",
          role: "core",
          applies: true,
          gradePoints: 90,

          metrics: {
            avoidedFricheAccidents: 11,
          },
        },
        trafficSecurity: { applies: true, gradePoints: 0, role: "bonus" },
        accessToHealthCare: { applies: true, gradePoints: 0, role: "bonus" },
        accessToLocalServices: { applies: true, gradePoints: 0, role: "bonus" },
        localHealthiness: { applies: true, gradePoints: 0, role: "bonus" },
      },
    },
    localAuthorityEconomicScore: {
      score: {
        letterGradeWithModifiers: "A",
        letterGrade: "A",
        gradePoints: 90,
      },
      indicators: {
        localAuthorityFinances: {
          letterGrade: "A",
          role: "core",
          applies: true,
          gradePoints: 90,

          metrics: {
            projectLocalAuthorityIndirectEconomicImpactsTotal: 3902899.054835231,
            percentageComparison: 2602,
            municipalityCapitalExpendituresAmount: 150000,
            municipalityCapitalExpendituresReferenceYear: "2025",
            municipalityCapitalExpendituresAccuracy: "city",
          },
        },
      },
    },
  },
} satisfies ProjectDevelopmentScore;

export const photovoltaicProjectDevelopmentScoreMock = {
  score: {
    letterGradeWithModifiers: "B",
    letterGrade: "B",
    gradePoints: 67,
  },
  details: {
    environmentScore: {
      score: {
        letterGradeWithModifiers: "B+",
        letterGrade: "B",
        gradePoints: 78,
      },
      indicators: {
        co2eqEmissionsVariation: {
          letterGrade: "A",
          role: "core",
          applies: true,
          gradePoints: 90,

          metrics: {
            avoidedCo2eqEmissions: 21596.039999999994,
            newStoredCo2Eq: 721.5999999999999,
            siteStatuQuoStoredCo2Eq: 2530,
            soilStoredPercentageVariation: 29,
          },
        },
        zanCompliance: {
          letterGrade: "A",
          role: "core",
          applies: true,
          gradePoints: 90,

          metrics: {
            permeableSurfaceDifference: {
              difference: 67200,
              percentVariation: 81,
            },
            newGreenSoilSurfaces: 136500,
            siteReconversionType: "friche",
          },
        },
        soilsQuality: {
          letterGrade: "A",
          role: "core",
          applies: true,
          gradePoints: 90,

          metrics: {
            permeableSurfaceDifference: {
              difference: 67200,
              percentVariation: 81,
            },
            contamination: {
              siteContaminatedSurface: 0,
              difference: 0,
              percentVariation: 0,
            },
          },
        },
        waterQuality: {
          letterGrade: "C",
          role: "core",
          applies: true,
          gradePoints: 50,

          metrics: {
            contamination: {
              siteContaminatedSurface: 0,
              difference: 0,
              percentVariation: 0,
            },
            prairieSurfaceDifference: 0,
            forestSurfaceDifference: 0,
            agriculturalSurfaceDifference: 0,
            wetLandSurfaceDifference: 0,
          },
        },
        ecosystemServices: {
          letterGrade: "B",
          role: "core",
          applies: true,
          gradePoints: 70,

          metrics: {
            ecosystemicServices: [
              {
                detailsByYear: [],
                cumulativeByYear: [],
                total: 180399.99999999997,
                name: "newStoredCo2Eq",
              },
              {
                detailsByYear: [],
                cumulativeByYear: [],
                total: 47510.80999479706,
                name: "waterCycle",
              },
            ],
          },
        },
      },
    },
    fullTimeJobsScore: {
      score: {
        letterGradeWithModifiers: "B",
        letterGrade: "B",
        gradePoints: 70,
      },
      indicators: {
        fullTimeJobs: {
          letterGrade: "B",
          role: "core",
          applies: true,
          gradePoints: 70,

          metrics: {
            fullTimeJobsDifferenceByHectare: 0.33,
            siteSurfaceArea: 14500,
            siteStatuQuoFullTimeJobs: 0,
            difference: 5.019054,
          },
        },
      },
    },
    localPeopleQualityOfLifeScore: {
      score: {
        letterGradeWithModifiers: "A",
        letterGrade: "A",
        gradePoints: 90,
      },
      indicators: {
        livingEnvironment: {
          letterGrade: "A",
          role: "core",
          applies: true,
          gradePoints: 90,

          metrics: {
            siteNature: "FRICHE",
            projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
            siteReconversionType: "friche",
            buildingsFloorAreaDistribution: undefined,
            soilEvolutionDetails: { newGreenSoilSurfaces: 5400 },
          },
        },
        fricheAccidents: {
          letterGrade: "A",
          role: "bonus",
          applies: true,
          gradePoints: 90,

          metrics: {
            avoidedFricheAccidents: 11,
          },
        },
        trafficSecurity: { applies: false, gradePoints: 0, role: "bonus" },
        accessToHealthCare: { applies: false, gradePoints: 0, role: "bonus" },
        accessToLocalServices: { applies: false, gradePoints: 0, role: "bonus" },
        localHealthiness: { applies: false, gradePoints: 0, role: "bonus" },
      },
    },
    localAuthorityEconomicScore: {
      score: {
        letterGradeWithModifiers: "A",
        letterGrade: "A",
        gradePoints: 90,
      },
      indicators: {
        localAuthorityFinances: {
          letterGrade: "A",
          role: "core",
          applies: true,
          gradePoints: 90,
          metrics: {
            projectLocalAuthorityIndirectEconomicImpactsTotal: 10201604.24463828,
            percentageComparison: 6801,
            municipalityCapitalExpendituresReferenceYear: "2025",
            municipalityCapitalExpendituresAmount: 150000,
            municipalityCapitalExpendituresAccuracy: "city",
          },
        },
      },
    },
  },
} satisfies ProjectDevelopmentScore;
