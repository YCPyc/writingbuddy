import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Calendar } from "lucide-react";
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
import { standardsService } from "@/src/domains/standards/service";
import { standardsRepository } from "@/src/domains/standards/repository";
import { StandardOption } from "@/src/domains/standards/model";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { supabase } from "@/lib/supabaseClient";
import { assignmentService } from "@/src/domains/assignments/service";
import { assignmentRepository } from "@/src/domains/assignments/repository";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "../../components/ui/calendar";

type AssignmentCreationPageProps = {
  onBack: () => void;
};

// Define form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  instructions: z.string().min(1, "Instructions are required"),
  standard: z.string().optional(),
  rubric: z.string().optional(),
  exemplar: z.string().optional(),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function AssignmentCreationPage({
  onBack,
  classCode,
  onSuccess,
}: AssignmentCreationPageProps & {
  classCode: string;
  onSuccess: (tab: string, shouldRefetch?: boolean) => void;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      instructions: "",
      standard: "",
      rubric: "",
      exemplar: "",
      dueDate: new Date(Date.now()),
    },
  });
  const [standards, setStandards] = useState<StandardOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [assignmentCode, setAssignmentCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandards = async () => {
      const service = standardsService(standardsRepository());
      const standardIds = [
        "DA1743190A534CB0AEC12F494BE1F8D7_D2489281_grades-11-12",
        "DA1743190A534CB0AEC12F494BE1F8D7_D1000242_grade-11",
      ];

      try {
        const options = await service.fetchStandardSets(standardIds);
        console.log("options", options);
        setStandards(options);
      } catch (error) {
        console.error("Error fetching standards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStandards();
  }, []);

  const handleSubmit = async (data: FormData) => {
    const service = assignmentService(assignmentRepository(supabase));
    const code = await service.createAssignment({
      class_code: classCode,
      title: data.title,
      instruction: data.instructions,
      standard: data.standard,
      rubric: data.rubric,
      exemplar: data.exemplar,
      due_date: data.dueDate.toISOString(),
    });

    if (code) {
      setAssignmentCode(code);
      setTimeout(() => onSuccess("assignments", true), 1500);
    }
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
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={(date: Date | undefined) => {
                            field.onChange(date);
                            setCalendarOpen(false);
                          }}
                          disabled={(date: Date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select when this assignment is due
                    </FormDescription>
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
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                          disabled={loading}
                        >
                          <span className="truncate mr-2">
                            {field.value
                              ? standards.find(
                                  (standard) => standard.value === field.value
                                )?.label || "Select standard..."
                              : "Select standard..."}
                          </span>
                          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search standards..." />
                          <CommandList>
                            <CommandEmpty>No standards found.</CommandEmpty>
                            <CommandGroup>
                              {standards.map((standard) => (
                                <CommandItem
                                  key={standard.value}
                                  value={standard.value}
                                  onSelect={(currentValue) => {
                                    field.onChange(
                                      currentValue === field.value
                                        ? ""
                                        : currentValue
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4 shrink-0",
                                      field.value === standard.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <span className="truncate">
                                    {standard.label}
                                  </span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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

              {assignmentCode && (
                <div className="mt-4 p-4 bg-muted rounded-lg border">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Assignment Created Successfully!
                  </p>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
