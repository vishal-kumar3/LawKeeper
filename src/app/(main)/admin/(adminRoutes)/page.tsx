import AppointOfficersCard from "@/components/SubdomainDashboard/AppointOfficersCard"
import { AppointOfficersCardProps, trackCardProps, TransferOfficersCardProps } from "./CardProps"

type props = {}

const SubDomain = (props: props) => {
  return (
    <div>
      <div className="border-b">
        <p className="text-4xl font-semibold">Dashboard</p>
        <p className="opacity-50 mt-1 mb-6">
          Learn more about your new dashboard and get started
        </p>
      </div>
      <AppointOfficersCard title="" card={trackCardProps} />
      <AppointOfficersCard title="Appoint/ Promote Officers" card={AppointOfficersCardProps} />
      <AppointOfficersCard title="Transfer Officers" card={TransferOfficersCardProps} />
    </div>
  )
}

export default SubDomain
