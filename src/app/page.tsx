import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <h1 className="text-7xl underline ">Ahmed</h1>
      <Button variant={`destructive`}> click me </Button>
      <Button variant={`ghost`}> click me </Button>
      <Button variant={`muted`}> click me </Button>
      <Button variant={`outline`}> click me </Button>
      <Button variant={`primary`}> click me </Button>
      <Button variant={`secondary`}> click me </Button>
      <Button variant={`teritary`}> click me </Button>
    </div>
  );
}
