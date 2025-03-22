"use client"
import { useEffect, useState } from "react";
import SubTransactions from "./subscriptionTabs/SubTransactions";
import SubSubscriptions from "./subscriptionTabs/SubSubscriptions";
import SubPlans from "./subscriptionTabs/SubPlans";  
import { usePathname, useRouter, useSearchParams } from "next/navigation"; 



const ViewSubscriptions = () => {
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const validTabs = ["transactions", "subscriptions", "plans"];
  const defaultTab = "transactions";

  // Get tab from the URL or fallback to default
  const currentTab = searchParams.get("tab") || defaultTab;

  const [activeTab, setActiveTab] = useState(validTabs.includes(currentTab) ? currentTab : defaultTab);

  useEffect(() => {
    // Update state if the URL changes
    if (validTabs.includes(currentTab)) {
      setActiveTab(currentTab);
    }
  }, [currentTab]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const newUrl = `${pathname}?tab=${newTab}`;
    router.push(newUrl, { scroll: false }); // Updates URL without full reload
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-300">
        {validTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "transactions" && <SubTransactions />}
        {activeTab === "subscriptions" && <SubSubscriptions />}
        {activeTab === "plans" && <SubPlans />}
      </div>
    </div>
  );
};

export default ViewSubscriptions;
