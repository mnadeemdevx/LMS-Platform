"use client";

import { Category } from "@prisma/client";
import {
    FcMusic,
    FcOldTimeCamera,
    FcSportsMode,
    FcFilmReel,
    FcEngineering,
    FcSalesPerformance,
    FcMultipleDevices,
} from "react-icons/fc";
import { IconType } from "react-icons";

import CategoryItem from "./category-item";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    Music: FcMusic,
    Photography: FcOldTimeCamera,
    Fitness: FcSportsMode,
    Filming: FcFilmReel,
    Engineering: FcEngineering,
    Accounting: FcSalesPerformance,
    "Computer Science": FcMultipleDevices,
};
const Categories = ({ items }: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    );
};
export default Categories;
