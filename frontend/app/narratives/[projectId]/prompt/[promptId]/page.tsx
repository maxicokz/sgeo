import { prompts } from "@/lib/narrative-data"
import ClientPage from "./client-page"

export function generateStaticParams() {
  return prompts.map((prompt) => ({
    projectId: prompt.projectId,
    promptId: prompt.id,
  }))
}

export default function PromptDetailPage({
  params
}: {
  params: { projectId: string; promptId: string }
}) {
  return <ClientPage params={params} />
}
