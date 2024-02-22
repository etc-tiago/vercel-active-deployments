import Link from "next/link";
import { Button } from "&/components/ui/button";
import { formatDistance } from 'date-fns';
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "&/components/ui/dropdown-menu";
import { Badge } from "&/components/ui/badge";
import { Separator } from "&/components/ui/separator";
import { revalidateTag } from "next/cache";
import { DropdownMenuItemCancel, RevalidateEffect, SelectState } from "./client";
import { GitBranchIcon, MoreHorizontalIcon } from "lucide-react";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || '';
const TEAM_ID = process.env.TEAM_ID || '';

export const dynamic = "force-dynamic";

const serverActionCancel = async (deployId: string) => {
  "use server";

  const url = `https://vercel.com/api/v12/deployments/${deployId}/cancel?teamId=${TEAM_ID}
`;

  try {
    const response = await fetch(url, {
      method: "PATCH", // Use o método PATCH para cancelar o deployment
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response);

    if (!response.ok) {
      return {
        status: "error",
        error: `Erro ao cancelar o deployment: ${response.statusText}`,
      };
    }

    const data = await response.json();
    revalidateTag("fetch-building");
    return { status: "ok", data };
  } catch (e) {
    console.error(e);
    return { status: "error", error: "motworking" };
  }
};

const serverActionRevalidate = async () => {
  "use server";
  revalidateTag("fetch-building");
};

const getDeployments = async (state: string) => {
  const url = `https://api.vercel.com/v6/deployments?teamId=${TEAM_ID}&state=${state}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
    },
    // next: { tags: ["fetch-building"] },
  });

  if (!response.ok) {
    return <>{`Error: ${response.statusText}`}</>;
  }

  const data: any = await response.json();
  return data;
};

export default async function Home({ params }: { params: { state: string } }) {
  const building = await getDeployments(params.state)

  const deployments: any[] = building.deployments;

  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-gray-100/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
        <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
          <h1 className="font-semibold text-3xl">Deployments</h1>
          <SelectState defaultValue={params.state} />
        </div>
        <div className="grid gap-6 max-w-6xl w-full mx-auto">
          <div className="border rounded-lg overflow-hidden grid gap-4 lg:gap-px lg:bg-gray-100">
            {deployments.length === 0 ? (
              <div className="flex flex-col lg:flex-row bg-white text-sm p-2 relative dark:bg-gray-950">
                <div className="font-medium">No deployment</div>
              </div>
            ) : (
              deployments.map((deployment) => {
                const yourDateMilliseconds = deployment.createdAt;
                const timeAgo = formatDistance(new Date(yourDateMilliseconds), new Date(), { addSuffix: true });
                return (
                  <div
                    key={deployment.uid}
                    className="flex flex-col lg:flex-row bg-white text-sm p-2 relative dark:bg-gray-950"
                  >
                    <div className="p-2 grid gap-1 flex-1">
                      <div className="font-medium">{deployment.uid}</div>
                      <div className="text-gray-500 dark:text-gray-400 space-x-2">
                        <span>{deployment.name}</span>
                        <Badge
                          variant={deployment.state === 'BUILDING' ? 'default' : "outline"}
                        >
                          {deployment.state}
                        </Badge>
                      </div>
                    </div>
                    <Separator className="my-2 lg:hidden" />
                    <div className="p-2 grid gap-1 flex-1">
                      <div className="flex items-center gap-2">
                        <GitBranchIcon className="w-4 h-4" />
                        <span>{deployment.meta.branchAlias}</span>
                      </div>
                    </div>
                    <Separator className="my-2 lg:hidden" />
                    <div className="p-2 grid gap-1 flex-1">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        {timeAgo}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="absolute top-4 right-4"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontalIcon className="w-4 h-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={deployment.inspectorUrl} target="_blank">
                          <DropdownMenuItem>View Deployment</DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItemCancel
                          action={serverActionCancel}
                          deployId={deployment.uid}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>
      <RevalidateEffect action={serverActionRevalidate} />
    </div>
  );
}
