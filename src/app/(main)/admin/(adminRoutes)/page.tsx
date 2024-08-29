import AppointOfficersCard from "@/components/SubdomainDashboard/AppointOfficersCard"
import { AppointOfficersCardProps, trackCardProps, TransferOfficersCardProps } from "./CardProps"
import Dashboard from "@/components/SubdomainDashboard/Dashboard"

type props = {}

const SubDomain = (props: props) => {
  return (
    <Dashboard title="Dashboard" description="Learn more about your new dashboard and get started">
      <AppointOfficersCard title="" card={trackCardProps} />
      <AppointOfficersCard title="Appoint/ Promote Officers" card={AppointOfficersCardProps} />
      <AppointOfficersCard title="Transfer Officers" card={TransferOfficersCardProps} />
    </Dashboard>
  )
}

export default SubDomain
