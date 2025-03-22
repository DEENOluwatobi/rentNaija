"use client"
import { AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button";
import {  Dialog, DialogContent, DialogDescription, DialogTitle ,DialogHeader, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAlert } from "@/contexts/AlertContext";
import { AxiosApi } from "@/lib/utils";
import { ApiPlansResponse, FeatureInterface, PlansInterface } from "@/types/subscription"; 
import { Check, Edit, Loader2, Plus, PlusIcon, Search, Trash, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { baseURL } from "@/../next.config";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";



const SubPlans = ()=>{
  
    return (
      <div className="p-6 bg-gray-50 min-h-screen"> 
       
         <PlanList />
      </div>
    );
}

export default SubPlans



const PlanForm = ({ isOpen, onClose, onSave, initialData }: any) => {
   
    const [plan, setPlan] = useState<PlansInterface>(initialData || {
        name: "",
        description: "",
        price: 2000,
        currency: "NGN",
        invoice_interval: "month",
        invoice_period: 3,
        features: [],
    });

    useEffect(() => {
      if (initialData) { 
          setPlan(initialData); // Ensure form updates when `initialData` changes
      }else{
        setPlan(plan=>({
             ...plan, 
              ...{
                id:undefined,
                name: "",
                description: "",
                price: 2000,
                currency: "NGN",
                invoice_interval: "month",
                invoice_period: 3,
                features: [],
            }
        }))
      }
    // console.log('initaial data',initialData);
  }, [initialData]);

    // Add a new feature
    const addFeature = () => {
        setPlan({ 
            ...plan, 
            features: [...plan.features, { name: "", description: "", sort_order: plan.features.length + 1 }] 
        });
    };

    // Remove a feature by index
    const removeFeature = (index: number) => {
        const updatedFeatures = plan.features.filter((_: any, i: number) => i !== index);
        setPlan({ ...plan, features: updatedFeatures });
    };

    // Handle feature updates
    const updateFeature = (index: number, key: string, value: string | number) => {
        const updatedFeatures = plan.features.map((feature:FeatureInterface, i: number) =>
            i === index ? { ...feature, [key]: value } : feature
        );
        setPlan({ ...plan, features: updatedFeatures });
    };

    // Submit form
    const handleSubmit = async () => {
        await onSave(plan);
        onClose();
    }; 

    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{initialData ? "Edit Plan" : "Add New Plan"}</DialogTitle>
                <DialogDescription>
                    {initialData ? "Modify an existing plan" : "Create a new plan with features"}
                </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 overflow-y-auto max-h-[350px]">
                <Input
                    placeholder="Plan Name"
                    defaultValue={plan.name}
                    onChange={(e) => setPlan({ ...plan, name: e.target.value })}
                />
                <div>
                    
                <Input
                    placeholder="Description"
                    defaultValue={plan.description}
                    onChange={(e) => setPlan({ ...plan, description: e.target.value })}
                />
                </div>

                <div>
                    
                <label>Price</label>
                <Input
                    placeholder="Price"
                    type="number"
                    defaultValue={plan.price}
                    onChange={(e) => setPlan({ ...plan, price: e.target.value })}
                />
                </div>
                <div>
                    <label>Type</label>
                    <select
                        defaultValue={plan.invoice_interval}
                        onChange={(e) => setPlan({ ...plan, invoice_interval: e.target.value })}
                    >
                        <option   value="month">Month</option>
                        <option value="year">Year</option>
                    </select>
                </div>
                <div>
                    <label>Duration </label>
                    
                      <Input
                    name="invoice_period"
                    placeholder="Duration" type="number" max={12}
                    defaultValue={plan.invoice_period}
                    onChange={(e) => setPlan({ ...plan, invoice_period: Number(e.target.value) })}
                />
                </div>
              

                {/* Features List */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Plan Features</h3>
                    {plan?.features?.map((feature:FeatureInterface, index:number) => (
                        <div key={index} className="grid grid-cols-3 gap-2 items-center">
                            <Input
                                placeholder="Feature Name"
                                defaultValue={feature.name}
                                onChange={(e) => updateFeature(index, "name", e.target.value)}
                            />
                            <Input
                                placeholder="Description"
                                defaultValue={feature.description}
                                onChange={(e) => updateFeature(index, "description", e.target.value)}
                            />
                            <Input
                                placeholder="Sort Order"
                                type="number"
                                defaultValue={feature.sort_order}
                                onChange={(e) => updateFeature(index, "sort_order", Number(e.target.value))}
                            />
                            <div>
                            <Button variant="destructive" className="p-1 bg-red-700 hover:bg-red-800 text-white text-xs my-2" onClick={() => removeFeature(index)}>
                                <Trash2Icon className="text-xs"/>
                            </Button>
                            </div>
                        </div>
                    ))}
                    <Button onClick={addFeature} className="flex" variant="secondary">
                        <PlusIcon /> Add Feature
                    </Button>
                </div>
            </div>

            <DialogFooter>
                <Button onClick={handleSubmit}>Save Plan</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    );
  };
  
  const PlanTableRow = ({ plan, onEdit, onDelete }: any) => (
    <TableRow>
      <TableCell>{plan.id}</TableCell>
      <TableCell>{plan.name}</TableCell>
      <TableCell>{plan.description || "-"}</TableCell>
      <TableCell>${plan.price || "0.00"}</TableCell>
      <TableCell>
        {plan?.features?.map((feature:FeatureInterface) => (
          <div key={feature.slug} className="mb-2">
            <span className="font-light text-xs "><Check/>{feature.name}</span> {feature.value}
          </div>
        ))}
      </TableCell>  
      <TableCell>
      <div className="flex space-x-2">

        <Button size="sm" variant="outline" onClick={() => onEdit(plan)}><Edit /></Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(plan.id)} className="ml-2"><Trash /></Button>
      </div>
      </TableCell>
    </TableRow>
  );
  
  const PlanList = () => {
            const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState<PlansInterface[]|null>( );
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlansInterface>( );
  
    useEffect(() => {
      fetchPlans();
    }, []);
  
    const fetchPlans = async () => {
        
      if(loading)return;
        setLoading(true);
        await AxiosApi('admin').get<ApiPlansResponse>(baseURL+"/plans"+(searchTerm?'?search='+searchTerm:''))
        .then((response)=> setPlans(response.data.data.data))
        .catch ((error:any) => showAlert( error?.response?.data?.message||  error.message || "Unable to Process, Please try again.","error"))
        .finally(()=>setLoading(()=>false));
     
    };   
  
    const handleDeletePlan = async (id: number) => {
    if(loading)return; setLoading(()=>true)
     if(confirm('This operation will prevent users from being able to subscribe to this plan')){
        
      await AxiosApi('admin').delete<ApiPlansResponse>(baseURL+`/plan/${id}`)
      .then((response)=> { 
        showAlert("Plan Deleted","success");
        setPlans(plans?.filter((plan) => plan.id !== id))})
      .catch ((error:any) => showAlert( error?.response?.data?.message||  error.message || "Unable to Process, Please try again.","error"))
      .finally(()=>setLoading(()=>false));
     }
    };
  
    const handleSavePlan = async (plan: PlansInterface) => {
     
        if(plan.id){
            await AxiosApi('admin').put(baseURL+`/plan/${plan.id}`,plan)
            .then((response)=> { 
              showAlert("Plan Updated","success");
                console.log(plan,response.data);
               if (plan.id) {
                setPlans(plans?.map((p) => (p.id === plan.id ? response.data : p)));
             
              }  
          
          })
            .catch ((error:any) => showAlert( error?.response?.data?.message||  error.message || "Unable to Process, Please try again.","error"))
            .finally(()=>{   fetchPlans(); setLoading(()=>false);});
     
        }else{
            await AxiosApi('admin').post(baseURL+`/plan`,plan)
            .then((response)=> { 
              showAlert("Plan Created","success"); 
             
          })
            .catch ((error:any) => showAlert( error?.response?.data?.message||  error.message || "Unable to Process, Please try again.","error"))
            .finally(()=>{   fetchPlans(); setLoading(()=>false);});

        }
        }
  
        const openEditForm = async (plan:PlansInterface) =>{ 
          setSelectedPlan(plan);
          setIsModalOpen(true); 
        }


    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Plans</h1>
        <div className="mb-4 flex items-center">
            <div className=" flex"> 
                <Search className="mr-2" /><Input
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            
            onKeyDown = {(e) => { if(e. key == 'Enter')fetchPlans(); }}
          /> 
            </div>
          <Button className="ml-auto" onClick={() => { setIsModalOpen(true); setSelectedPlan(undefined) }}>
            <Plus /> Add Plan
          </Button>
        </div>
  
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                   <TableCell colSpan={6} className="text-center">
                                                      <div className='flex justify-center '>
                                                          <Loader2 className='animate-spin'/> Loading...
                                                      </div>
                                                       </TableCell>
                </TableRow>
              ) : plans?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No plans found</TableCell>
                </TableRow>
              ) : (
                plans?.map((plan) => (
                  <PlanTableRow key={plan.id} plan={plan} onEdit={openEditForm} onDelete={handleDeletePlan} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
  
        <PlanForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSavePlan} initialData={selectedPlan} />
      </div>
    );
  };
   