import type React from "react"
import { Dumbbell, CastleIcon as ChessKnight, Plane, Utensils } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HobbyItem {
  icon: React.ReactNode
  content: string
}

export function Hobbies() {
  const hobbyItems: HobbyItem[] = [
    {
      icon: <Dumbbell className="h-5 w-5 text-red-500" />,
      content: "Lifting weights",
    },
    {
      icon: <ChessKnight className="h-5 w-5 text-purple-500" />,
      content: "Chess",
    },
    {
      icon: <Plane className="h-5 w-5 text-blue-500" />,
      content: "Traveling",
    },
    {
      icon: <Utensils className="h-5 w-5 text-amber-500" />,
      content: "Trying new foods",
    },
  ]

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-emerald-50 border-b border-emerald-100 pb-4">
        <div className="flex items-center gap-3">
          <Dumbbell className="h-7 w-7 text-emerald-600" />
          <CardTitle className="text-2xl font-bold text-gray-800">Hobbies</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ul className="space-y-5">
          {hobbyItems.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
              <div>
                <span className="text-gray-800">{item.content}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
