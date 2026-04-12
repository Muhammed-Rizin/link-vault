import * as React from "react";
import { Link2, Bookmark, Tag, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface ProfileStatsProps {
  totalLinks: number;
  totalCategories: number;
}

export function ProfileStats({ totalLinks, totalCategories }: ProfileStatsProps) {
  const stats = [
    { label: "Total Links", value: totalLinks, icon: Link2, color: "text-blue-500" },
    { label: "Categories", value: totalCategories, icon: Tag, color: "text-purple-500" },
    { label: "Backlog", value: Math.ceil(totalLinks * 0.7), icon: Bookmark, color: "text-orange-500" },
    { label: "Archived", value: Math.floor(totalLinks * 0.3), icon: LayoutGrid, color: "text-green-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/60 bg-card/40 shadow-sm overflow-hidden group hover:border-primary/30 transition-colors">
          <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </CardTitle>
            <stat.icon className={`size-3.5 ${stat.color} opacity-70 group-hover:scale-110 transition-transform`} />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold font-(family-name:--font-geist-mono)">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
