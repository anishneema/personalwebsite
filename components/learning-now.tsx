import type React from "react"
import { Book, Code, Lightbulb, Pencil, Brain } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LearningItem {
  icon: React.ReactNode
  category: string
  content: string
}

export function LearningNow() {
  const learningItems: LearningItem[] = [
    {
      icon: <Book className="h-5 w-5 text-blue-500" />,
      category: "Reading",
      content: "Designing Data-Intensive",
    },
    {
      icon: <Pencil className="h-5 w-5 text-green-500" />,
      category: "Experimenting with",
      content: "LangChain + RAG",
    },
    {
      icon: <Code className="h-5 w-5 text-gray-700" />,
      category: "Coding",
      content: "AI tutoring app",
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      category: "Thinking about",
      content: "fairness in LLMs",
    },
  ]

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-emerald-50 border-b border-emerald-100 pb-4">
        <div className="flex items-center gap-3">
          <Brain className="h-7 w-7 text-emerald-600" />
          <CardTitle className="text-2xl font-bold text-gray-800">What I'm Learning Now</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ul className="space-y-5">
          {learningItems.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
              <div>
                <span className="font-medium text-gray-700">{item.category}: </span>
                <span className="text-gray-800">{item.content}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
