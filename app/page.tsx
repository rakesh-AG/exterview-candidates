import CandidatesTable from "@/components/candidates-table"
import { FilterBar } from "@/components/filter-bar"

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Candidate Applications</h1>
      <FilterBar />
      <CandidatesTable />
    </div>
  )
}
