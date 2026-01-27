import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Objection {
  id: string;
  client: string;
  objection: string;
  response: string;
  date: string;
  status: "open" | "resolved";
}

export const ObjectionTracker = () => {
  const [objections, setObjections] = useState<Objection[]>([
    {
      id: "1",
      client: "Metro Medical Center",
      objection: "Pricing concerns for bulk orders",
      response: "Proposed volume-based discount structure",
      date: "2024-03-15",
      status: "open"
    },
    {
      id: "2",
      client: "HealthCare Plus",
      objection: "Integration with existing systems",
      response: "Scheduled technical demo with IT team",
      date: "2024-03-14",
      status: "resolved"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newObjection, setNewObjection] = useState({
    client: "",
    objection: "",
    response: ""
  });

  const handleAddObjection = () => {
    if (newObjection.client && newObjection.objection) {
      setObjections([
        {
          id: Date.now().toString(),
          ...newObjection,
          date: new Date().toISOString().split('T')[0],
          status: "open"
        },
        ...objections
      ]);
      setNewObjection({ client: "", objection: "", response: "" });
      setShowForm(false);
      toast.success("Objection tracked successfully");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Objection Tracking</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Objection
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Input
              placeholder="Client name"
              value={newObjection.client}
              onChange={(e) => setNewObjection({ ...newObjection, client: e.target.value })}
            />
            <Textarea
              placeholder="Describe the objection..."
              value={newObjection.objection}
              onChange={(e) => setNewObjection({ ...newObjection, objection: e.target.value })}
            />
            <Textarea
              placeholder="Your response or action taken..."
              value={newObjection.response}
              onChange={(e) => setNewObjection({ ...newObjection, response: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddObjection}>Save</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {objections.map((obj) => (
          <Card key={obj.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{obj.client}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{obj.date}</p>
                </div>
                <Badge variant={obj.status === "resolved" ? "default" : "outline"}>
                  {obj.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Objection:</p>
                <p className="text-card-foreground">{obj.objection}</p>
              </div>
              {obj.response && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Response:</p>
                  <p className="text-card-foreground">{obj.response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
