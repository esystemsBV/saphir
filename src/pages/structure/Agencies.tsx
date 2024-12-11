import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Title from "@/components/ui/Title";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/acco";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinning } from "@/components/ui/loadingspining";
import fetchData from "@/apis/HandleGetTable";
import { EditIcon, Plus, Trash2 } from "lucide-react";
import { HandleDelete } from "@/apis/HandleDelete";
import { Button } from "@/components/ui/button";
import { agencies } from "@/lib/database";
import AddAgencies from "./AddAgencies";

export default function Agencies() {
  const { t } = useTranslation();

  const [infos, setInfos] = useState<agencies | null>(null);
  const {
    data,
    refresh,
    loading,
  }: { data: agencies[]; refresh: () => void; loading: boolean } = fetchData({
    page: "agencies",
  });
  const [updating, setUpdating] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    if (updating) {
      setOpenKeys(["1"]);
    }
  }, [updating]);

  const handleAccordionChange = (value: string) => {
    setOpenKeys(value ? [value] : []);
    setUpdating(false);
  };

  return (
    <div>
      <Accordion
        type="single"
        collapsible
        value={openKeys[0]}
        onValueChange={handleAccordionChange}
      >
        <AccordionItem value="1">
          <AccordionTrigger>
            <Button className="bg-blue-500 hover:bg-blue-700">
              <Plus />{" "}
              {updating ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
            </Button>
          </AccordionTrigger>
          <AccordionContent>
            <AddAgencies
              infos={infos}
              setInfos={setInfos}
              updating={updating}
              refresh={refresh}
              setUpdating={handleAccordionChange}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div>
        <Title title={t("agencies.your")} />
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("phone")}</TableHead>
              <TableHead>{t("location")}</TableHead>
              <TableHead>{t("responsible")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <LoadingSpinning />
                </TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map((agency) => (
                <TableRow key={agency.reference}>
                  <TableCell>{agency.name}</TableCell>
                  <TableCell>{agency.phone}</TableCell>
                  <TableCell>{agency.location}</TableCell>
                  <TableCell>{agency.responsible}</TableCell>
                  <TableCell className="flex gap-2">
                    <EditIcon
                      onClick={() => {
                        setInfos(agency);
                        setUpdating(true);
                        setOpenKeys(["1"]);
                      }}
                      className="size-5.5 cursor-pointer text-blue-500"
                    />
                    <Trash2
                      onClick={() =>
                        HandleDelete({
                          page: "agencies",
                          id: `${agency.reference}`,
                          refresh: refresh,
                        })
                      }
                      className="size-5.5 cursor-pointer text-destructive"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("agencies.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
