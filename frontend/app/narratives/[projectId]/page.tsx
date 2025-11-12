import { narrativeProjects } from "@/lib/narrative-data"
import ClientPage from "./client-page"

export function generateStaticParams() {
  return narrativeProjects.map((project) => ({
    projectId: project.id,
  }))
}

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  return <ClientPage params={params} />
}
