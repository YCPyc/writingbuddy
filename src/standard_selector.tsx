import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import appConfig from "@@/app.config";
import { MultiSelect } from "./components/multi-select";

function StandardsDropdown() {
  const [standards, setStandards] = useState<any>([]);
  const [standardsMulti, setStandardsMulti] = useState<any>([]);
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await fetch(
          "https://commonstandardsproject.com/api/v1/standard_sets/D99D1AE64000404C8DB7CB8C0648FF6D",
          {
            method: "GET",
            headers: {
              Authorization: `${appConfig.standardsApiKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const dataStandards = data?.data?.standards;
        if (!dataStandards) {
          console.error("Unexpected API response structure", data);
          return;
        }
        const standardsList = Object.values(dataStandards).filter(
          (item: any) => item.statementNotation
        );

        const standardsListMulti = standardsList.map((item: any) => ({
          value: item.statementNotation,
          label: `${item.statementNotation}`,
        }));

        setStandards(standardsList);
        setStandardsMulti(standardsListMulti);
      } catch (error) {
        console.error("Error fetching standards:", error);
      }
    };

    fetchStandards();
  }, []);
  return (
    <>
      {standards.length > 0 ? (
        <>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Standards" />
            </SelectTrigger>
            <SelectContent>
              {standards.map((standard: any, index: any) => (
                <SelectItem key={index} value="hi">
                  {standard.statementNotation}: {standard.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      ) : (
        <></>
      )}

      <MultiSelect
        options={standardsMulti}
        onValueChange={setSelectedStandards}
        defaultValue={selectedStandards}
        placeholder="Select standards"
        variant="inverted"
        animation={2}
        maxCount={3}
      />
    </>
  );
}

export default StandardsDropdown;
