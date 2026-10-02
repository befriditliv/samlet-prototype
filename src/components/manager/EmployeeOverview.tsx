import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, Building2, FileCheck2, MessageSquareText, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { teamMembers } from "@/data/managerDemo";

export const EmployeeOverview = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Regional brief</h2>
          <p className="mt-1 text-sm text-muted-foreground">Selected period · Demo data</p>
        </div>
        <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm">
          <CardContent className="p-6">
            <p className="max-w-4xl text-sm leading-6 text-foreground">The region has 144 registered employee contacts across 70 of 245 assigned HCOs. Documentation is available for 124 contacts, and the weighted documentation quality is 7.8 based on 103 assessed debriefs. Current customer signals without an upcoming registered meeting, recurring questions about practical initiation, and 20 unfinished debriefs provide three concrete areas for the next manager conversations.</p>
            <div className="mt-4 flex flex-wrap gap-2"><Badge variant="outline">Source: TEAM-2026-10</Badge><Badge variant="outline">Demo data</Badge></div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [Users, "Registered contacts", "144", "Employee contacts only"],
          [Building2, "Contacted HCOs", "70 / 245", "Unique HCOs"],
          [FileCheck2, "Documentation available", "124 / 144", "20 unfinished"],
          [MessageSquareText, "Debrief quality", "7.8 / 10", "Weighted · n = 103"],
        ].map(([Icon, label, value, note]) => (
          <Card key={String(label)} className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm"><CardContent className="p-5"><div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10"><Icon className="h-4 w-4 text-primary" /></div><p className="text-sm text-muted-foreground">{String(label)}</p><p className="mt-1 text-2xl font-bold text-foreground">{String(value)}</p><p className="mt-1 text-xs text-muted-foreground">{String(note)}</p></CardContent></Card>
        ))}
      </section>

      <section className="space-y-4">
        <div><h2 className="text-xl font-bold text-foreground">Regional priorities</h2><p className="mt-1 text-sm text-muted-foreground">Each priority opens the underlying demo cases</p></div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ["Current", "Customer signals", "Two current signals have no upcoming registered meeting.", "View Christian", "/manager/employee/christian#signals"],
            ["Selected period", "Practical initiation", "The question appears in 12 of 60 analyzed debriefs.", "View theme", "/manager/employee/christian#themes"],
            ["Selected period", "Unfinished debriefs", "11 for Christian and 9 for Sofie.", "View documentation", "/manager/employee/christian#documentation"],
          ].map(([scope, title, text, action, href]) => <Card key={title} className="border-0 shadow-sm"><CardContent className="p-5"><Badge variant="secondary">{scope}</Badge><h3 className="mt-3 font-semibold text-foreground">{title}</h3><p className="mt-2 min-h-10 text-sm leading-5 text-muted-foreground">{text}</p><Button variant="ghost" className="mt-3 h-8 px-0 text-primary" onClick={() => navigate(href)}>{action}<ArrowRight className="ml-1 h-4 w-4" /></Button></CardContent></Card>)}
        </div>
      </section>

      <section className="space-y-4">
        <div><h2 className="text-xl font-bold text-foreground">Employees</h2><p className="mt-1 text-sm text-muted-foreground">Select an employee to prepare the next 1:1</p></div>
        <Card className="border-0 shadow-sm overflow-hidden">
          <Table>
            <TableHeader><TableRow className="bg-muted/30"><TableHead>Employee</TableHead><TableHead>District</TableHead><TableHead>Contacts</TableHead><TableHead>Contacted HCOs</TableHead><TableHead>Documentation</TableHead><TableHead>Quality</TableHead><TableHead className="min-w-60">Attention point</TableHead></TableRow></TableHeader>
            <TableBody>{teamMembers.map((member) => <TableRow key={member.slug} className="cursor-pointer" onClick={() => navigate(`/manager/employee/${member.slug}`)}><TableCell><button className="text-left font-semibold text-primary hover:underline">{member.name}</button><p className="text-xs text-muted-foreground">{member.role} · Demo</p></TableCell><TableCell>{member.district}</TableCell><TableCell className="font-semibold">{member.contacts}</TableCell><TableCell>{member.hcos}</TableCell><TableCell>{member.documentation}</TableCell><TableCell>{member.qualityN ? <>{member.quality}<span className="block text-xs text-muted-foreground">n = {member.qualityN}</span></> : member.quality}</TableCell><TableCell><div className="flex gap-2 text-sm text-muted-foreground"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{member.attention}</div></TableCell></TableRow>)}</TableBody>
          </Table>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="border-0 shadow-sm"><CardContent className="p-6"><h2 className="text-lg font-bold">District coverage</h2><div className="mt-5 grid gap-4 sm:grid-cols-3">{[["Copenhagen East","40 / 90"],["Copenhagen West","30 / 80"],["Copenhagen North","0 / 75"]].map(([district,value]) => <div key={district} className="border-l-2 border-primary/30 pl-4"><p className="text-sm text-muted-foreground">{district}</p><p className="mt-1 text-xl font-bold">{value}</p><p className="text-xs text-muted-foreground">contacted HCOs</p></div>)}</div></CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-6"><p className="text-sm text-muted-foreground">Digital portfolio activity</p><p className="mt-2 text-3xl font-bold">410</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Separate portfolio interactions. Not included in 144 employee contacts.</p></CardContent></Card>
      </section>
    </div>
  );
};
