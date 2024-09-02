"use client"

import * as React from "react"
import { AddressWithPoliceStation, State } from "@/types/address.types"
import { SelectStationForm } from "./PoliceOfficer/AssignStationForm"


export const AddressForm = ({ state }: { state: State[] }) => {
  const [stations, setStations] = React.useState<AddressWithPoliceStation[]>([]);

  return (
    <div className="space-y-5">
      <SelectStationForm state={state} setStation={setStations} />
    </div>
  );
}
