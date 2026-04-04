import type { TelemetrySnapshot } from "@/types/telemetry";
import type { HealthIndex } from "@/types/health";

export interface Recommendation {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  parameter: string;
}

interface Rule {
  parameter: string;
  check: (s: TelemetrySnapshot, h: HealthIndex) => boolean;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
}

const RULES: Rule[] = [
  {
    parameter: "temperature",
    check: (s) => s.temperature > 95,
    priority: "high",
    title: "Снизить нагрузку на двигатель",
    description: "Температура двигателя выше 95°C. Рекомендуется снизить тяговое усилие и контролировать охлаждение.",
  },
  {
    parameter: "fuelLevel",
    check: (s) => s.fuelLevel < 25,
    priority: "high",
    title: "Запланировать дозаправку",
    description: "Уровень топлива ниже 25%. Запланируйте остановку на ближайшей станции с депо.",
  },
  {
    parameter: "vibration",
    check: (s) => s.vibration > 5,
    priority: "high",
    title: "Диагностика вибрации",
    description: "Повышенная вибрация может указывать на износ подшипников или дисбаланс. Рекомендуется осмотр.",
  },
  {
    parameter: "brakePressure",
    check: (s) => s.brakePressure < 0.3,
    priority: "high",
    title: "Проверить тормозную систему",
    description: "Давление в тормозной магистрали ниже нормы. Возможна утечка или неисправность компрессора.",
  },
  {
    parameter: "voltage",
    check: (s) => s.voltage < 22.5,
    priority: "medium",
    title: "Проверить генератор",
    description: "Напряжение ниже оптимального диапазона. Проверьте состояние генератора и контактной сети.",
  },
  {
    parameter: "efficiency",
    check: (s) => s.efficiency < 60,
    priority: "medium",
    title: "Оптимизировать режим работы",
    description: "КПД ниже 60%. Проверьте режим тяги и состояние электрических цепей.",
  },
  {
    parameter: "oilTemperature",
    check: (s) => s.oilTemperature > 110,
    priority: "medium",
    title: "Контроль температуры масла",
    description: "Температура масла выше нормы. Проверьте уровень и состояние масла, работу маслоохладителя.",
  },
  {
    parameter: "health",
    check: (_, h) => h.score < 50,
    priority: "high",
    title: "Требуется техническое обслуживание",
    description: "Общий индекс здоровья ниже 50. Рекомендуется внеплановая диагностика на ближайшей станции.",
  },
];

export function getRecommendations(
  snapshot: TelemetrySnapshot,
  health: HealthIndex,
): Recommendation[] {
  return RULES
    .filter((rule) => rule.check(snapshot, health))
    .map((rule) => ({
      id: rule.parameter,
      priority: rule.priority,
      title: rule.title,
      description: rule.description,
      parameter: rule.parameter,
    }))
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });
}
