import HabitList from "@/components/HabitList";
import { HabitProvider } from "@/contexts/HabitContext";

export default function Home() {
  return (
    <div>
      <HabitProvider>
        <HabitList />
      </HabitProvider>
    </div>
  );
}
