"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CardContent, CardTitle } from "../../ui/card"



type props = {}

const AssignStationForm = (props: props) => {

  // Choose Station
  // You can choose multiple officers
  // Can see already assigned officers
  // Can remove officers from the station
  // 

  return (
    <div>
      AssignStationForm
    </div>
  )
}

export default AssignStationForm
