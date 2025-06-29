import HabitList from "@/components/HabitList";
import Navbar from "@/components/Navbar";
import { HabitProvider } from "@/contexts/HabitContext";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <HabitProvider>
        <HabitList />
      </HabitProvider>
    </div>
  );
}
