import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function CategoryTabs({ onCategoryChange, currentCategory = "length" }) {
  return (
    <Tabs value={currentCategory} onValueChange={onCategoryChange}>
      <TabsList className="grid w-full grid-cols-3 gap-2 bg-transparent p-0">
        <TabsTrigger 
          value="length" 
          className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg py-3 font-medium transition-all duration-200 border border-gray-200 data-[state=active]:border-blue-500"
        >
          Length
        </TabsTrigger>
        <TabsTrigger 
          value="weight" 
          className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-lg py-3 font-medium transition-all duration-200 border border-gray-200 data-[state=active]:border-green-500"
        >
          Weight
        </TabsTrigger>
        <TabsTrigger 
          value="temperature" 
          className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg py-3 font-medium transition-all duration-200 border border-gray-200 data-[state=active]:border-orange-500"
        >
          Temperature
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}