import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import React from "react";

interface CustomBreadcrumbProps {
  breadCrumbItems?: { link: string; label: string }[];
  breadCrumbPage: string;
}

const CustomBreadcrumb = ({
  breadCrumbItems,
  breadCrumbPage,
}: CustomBreadcrumbProps) => {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="flex items-center justify-center hover:text-purple-500"
            >
              <Home className="size-4 mr-2" /> Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {breadCrumbItems &&
            breadCrumbItems.map((item, ind) => (
              <React.Fragment key={ind}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={item.link}
                    className="flex items-center justify-center hover:text-purple-500"
                  >
                    {item.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            ))}

          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="flex items-center justify-center hover:text-purple-500"
            >
              {breadCrumbPage}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default CustomBreadcrumb;
