import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useForm } from "react-hook-form";

type AssignmentCreationPageProps = {
  onBack: () => void;
};

type FormData = {
  title: string;
  instructions: string;
  standard: string;
  rubric: string;
  exemplar: string;
};

export function AssignmentCreationPage({
  onBack,
}: AssignmentCreationPageProps) {
  const form = useForm<FormData>();

  const handleSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    // TODO: Handle form submission
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-3xl">
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <h1 className="text-3xl font-bold">Create New Assignment</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
          <CardDescription>
            Fill out the form below to create a new assignment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter assignment title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter assignment instructions"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="standard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State & Common Core Standards</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a standard" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ccss.ela-literacy.ri.9-10.1">
                          CCSS.ELA-LITERACY.RI.9-10.1
                        </SelectItem>
                        <SelectItem value="ccss.ela-literacy.ri.9-10.2">
                          CCSS.ELA-LITERACY.RI.9-10.2
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rubric"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rubric</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter rubric details"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your rubric criteria and scoring guidelines
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exemplar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exemplar</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter exemplar content"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide an example of what you expect from students
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Create Assignment
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
