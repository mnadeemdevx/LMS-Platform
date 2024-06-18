'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';
import { Course } from '@prisma/client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';

interface PriceFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    price: z.coerce.number(),
});
const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success('Course updated!');
            toggleEdit();
            router.refresh();
        } catch {
            toast.error('Something went wrong!');
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course price
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit price
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p
                    className={cn(
                        'text-sm mt-2',
                        !initialData.price && 'text-slate-700 italic',
                    )}
                >
                    {initialData.price
                        ? formatPrice(initialData.price)
                        : 'No price'}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isSubmitting}
                                                step="0.01"
                                                placeholder="set a price for your course"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default PriceForm;
