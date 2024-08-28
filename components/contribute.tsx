import Link from "next/link";
import { Doc } from "contentlayer/generated";
import { BugIcon, LightbulbIcon, PencilIcon } from "lucide-react";


export function Contribute({ doc }: { doc: Doc }) {
  const contributeLinks = [
    {
      text: "Report an issue",
      icon: BugIcon,
      
      
    },
    {
      text: "Request a feature",
      icon: LightbulbIcon,
    
    },
    {
      text: "Edit this page",
      icon: PencilIcon,
    
    },
  ];

  return (
    <div className="space-y-2">
      <p className="font-medium">Contribute</p>
      <ul className="m-0 list-none">
        {contributeLinks.map((link, index) => (
          <li key={index} className="mt-0 pt-2">
            <Link
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <link.icon className="mr-2 size-4" />
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
