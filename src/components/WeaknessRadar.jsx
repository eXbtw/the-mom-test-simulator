import { computeWeaknessProfile } from '../utils/weaknessProfile'

export default function WeaknessRadar({ history }) {
  const profile = computeWeaknessProfile(history)

  if (!profile.ready) {
    return (
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Профиль слабых мест</h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Пройдите ещё несколько интервью — соберём статистику по вашим типичным ошибкам
        </p>
      </div>
    )
  }

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Профиль слабых мест</h2>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Доля вопросов такого типа среди {profile.totalEvaluated} оценённых реплик
      </p>
      <div className="mt-3 space-y-2.5">
        {profile.items.map((item) => (
          <div key={item.type}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              <span className="text-gray-400 dark:text-gray-500">
                {item.share}% · {item.count}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                className="h-1.5 rounded-full bg-[#C6402F] dark:bg-[#FF5A42]"
                style={{ width: `${Math.max(item.share, 4)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
