import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Eye, EditIcon } from "lucide-react";
import AddFamily from "@/components/depot/AddFamily";
import Title from "@/components/ui/Title";
import Error from "@/components/ui/Error";
import LoadingSpinner from "@/components/others/LoadingLogo";
import { families } from "@/lib/database";
import fetchData from "@/apis/HandleGetTable";
import { HandleDelete } from "@/apis/HandleDelete";
import { Link } from "react-router-dom";
import brokenImage from "@/assets/brokenImage.png";
import { def } from "@/data/Links";
import { FormPreNumbers } from "@/common/Functions";

export default function Families() {
  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<families | null>(null);

  const {
    data,
    loading,
    refresh,
    error,
  }: {
    data: families[];
    loading: boolean;
    refresh: () => void;
    error: boolean;
  } = fetchData({
    page: "families",
  });

  const handleAccordionChange = (value: string) => {
    setOpenKeys(value ? [value] : []);
  };

  if (error) {
    return <Error title={t("families.error.loading")} />;
  }

  return (
    <div className="space-y-6">
      <Accordion
        type="single"
        collapsible
        value={openKeys[0]}
        onValueChange={handleAccordionChange}
      >
        <AccordionItem value="1">
          <AccordionTrigger>
            <Title title={t("families.add")} />
          </AccordionTrigger>
          <AccordionContent>
            <AddFamily
              edit={edit}
              setEdit={() => setEdit(!edit)}
              refresh={refresh}
              selectedFamily={selectedFamily}
              setSelectedFamily={setSelectedFamily}
              close={() => setOpenKeys(["0"])}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div>
        <Title title={t("families.your")} />
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>{t("image")}</TableHead>
              <TableHead>{t("families.designation")}</TableHead>
              <TableHead>{t("families.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map((family, id) => (
                <TableRow key={id}>
                  <TableCell className="w-10">
                    <img
                      src={family.image ? `${def}${family.image}` : brokenImage}
                      alt={family.name}
                      className="size-12 rounded-sm bg-main"
                    />
                  </TableCell>
                  <TableCell className="capitalize">
                    <p className="text-base font-medium">{family.name}</p>
                    <p className="text-gray-500 -mt-0.5">
                      {FormPreNumbers(`${family.reference}`)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link to={`${family.reference}`}>
                        <Eye className="size-5.5 cursor-pointer text-green-500" />
                      </Link>
                      <EditIcon
                        onClick={() => {
                          setSelectedFamily(family);
                          setEdit(true);
                          setOpenKeys(["1"]);
                        }}
                        className="size-5.5 cursor-pointer text-blue-500"
                      />
                      <Trash2
                        onClick={() =>
                          HandleDelete({
                            page: "families",
                            id: `${family.reference}`,
                            refresh: refresh,
                          })
                        }
                        className="size-5.5 cursor-pointer text-destructive"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  {t("families.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
