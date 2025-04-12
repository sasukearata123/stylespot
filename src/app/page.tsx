"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface FashionItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function Home() {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [items, setItems] = useState<FashionItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: 0,
  });
  const [sortBy, setSortBy] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    freeShipping: false,
    inStock: false,
  });
  const { toast } = useToast();

  const handleAddItem = () => {
    if (
      newItem.name.trim() === "" ||
      newItem.description.trim() === "" ||
      newItem.imageUrl.trim() === "" ||
      newItem.price <= 0
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    const newItemWithId: FashionItem = {
      ...newItem,
      id: String(Date.now()),
    };
    setItems([...items, newItemWithId]);
    setNewItem({ name: "", description: "", imageUrl: "", price: 0 });
    setIsAddItemOpen(false);
    toast({
      title: "Success",
      description: "Item added successfully!",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "price_asc") {
      return a.price - b.price;
    } else if (sortBy === "price_desc") {
      return b.price - a.price;
    } else {
      return Date.parse(b.id) - Date.parse(a.id);
    }
  });

  const filteredItems = sortedItems.filter((item) => {
    if (filters.freeShipping && item.price > 50) {
      return false;
    }
    if (filters.inStock && item.price === 0) {
      return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          StyleSpot Marketplace
        </h1>
        {/* Add Item Button */}
        <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
          <Button
            variant="accent"
            onClick={() => setIsAddItemOpen(true)}
            className="rounded-full"
          >
            <Icons.plusCircle className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-primary">
              Add a New Fashion Item
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new item to the marketplace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={newItem.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={newItem.imageUrl}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={newItem.price}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <Button
            type="submit"
            onClick={handleAddItem}
            variant="accent"
            className="rounded-full"
          >
            Add Item
          </Button>
        </DialogContent>
      </Dialog>
      </div>

      <div className="flex justify-between items-center mb-4">
        {/* Sorting */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtering */}
        <div className="flex items-center space-x-4">
          <Label
            htmlFor="freeShipping"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Free Shipping
          </Label>
          <Switch
            id="freeShipping"
            checked={filters.freeShipping}
            onCheckedChange={(checked) =>
              setFilters({ ...filters, freeShipping: checked })
            }
          />
          <Label
            htmlFor="inStock"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            In Stock
          </Label>
          <Switch
            id="inStock"
            checked={filters.inStock}
            onCheckedChange={(checked) =>
              setFilters({ ...filters, inStock: checked })
            }
          />
        </div>
      </div>

      {/* Marketplace Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="rounded-lg shadow-md transition-transform hover:scale-105"
          >
            <CardHeader>
              <CardTitle className="text-primary">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={item.imageUrl}
                alt={item.name}
                className="rounded-md mb-4 w-full h-48 object-cover"
              />
              <CardDescription>{item.description}</CardDescription>
              <p className="text-lg font-semibold mt-2 text-primary">
                ${item.price.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
