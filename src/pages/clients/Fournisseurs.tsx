import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { Trash2, Eye, EditIcon, Plus } from "lucide-react";
import Title from "@/components/ui/Title";
import Error from "@/components/ui/Error";
import LoadingSpinner from "@/components/others/LoadingLogo";
import { companyPapers, fournisseurs } from "@/lib/database";
import fetchData from "@/apis/HandleGetTable";
import { HandleDelete } from "@/apis/HandleDelete";
import { FormPreNumbers } from "@/common/Functions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddFournisseurs from "@/components/clients/AddFournisseur";
import { Button } from "@/components/ui/button";

export default function Fournisseurs() {
  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [dataToAdd, setDataToAdd] = useState<fournisseurs | null>(null);
  const [showCompanyInformation, setShowCompanyInformation] =
    useState<boolean>(false);
  const [CompanyInformation, setCompanyInformation] =
    useState<null | companyPapers>(null);

  const {
    data,
    loading,
    refresh,
    error,
  }: {
    data: fournisseurs[];
    loading: boolean;
    refresh: () => void;
    error: boolean;
  } = fetchData({
    page: "fournisseurs",
  });

  const handleAccordionChange = (value: string) => {
    setOpenKeys(value ? [value] : []);
  };

  if (error) {
    return <Error title={t("error")} />;
  }

  return (
    <>
      {showCompanyInformation && (
        <div className=" w-screen h-screen bg-black/40 fixed z-40 top-0 left-0"></div>
      )}
      <Accordion
        type="single"
        collapsible
        value={openKeys[0]}
        onValueChange={handleAccordionChange}
      >
        <AccordionItem value="1">
          <AccordionTrigger>
            <Button className="bg-blue-500 hover:bg-blue-700">
              <Plus /> {edit ? t("fournisseurs.edit") : t("fournisseurs.add")}
            </Button>
          </AccordionTrigger>
          <AccordionContent>
            <AddFournisseurs
              edit={edit}
              setEdit={() => setEdit(!edit)}
              refresh={refresh}
              data={dataToAdd}
              setData={setDataToAdd}
              close={() => setOpenKeys(["0"])}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div>
        <Title title={t("fournisseurs.your")} />
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>{t("designation")}</TableHead>
              <TableHead>{t("Phone Number")}</TableHead>
              <TableHead>{t("address")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map((fournisseur, id) => (
                <TableRow key={id}>
                  <TableCell className="capitalize">
                    <p className="text-base font-medium">
                      {fournisseur.fullname}
                    </p>
                    <p className="text-gray-500 -mt-0.5">
                      {FormPreNumbers(`${fournisseur.reference}`)}
                    </p>
                  </TableCell>
                  <TableCell>{fournisseur.phone}</TableCell>
                  <TableCell>{fournisseur.address}</TableCell>
                  <TableCell>{t(fournisseur.type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {fournisseur.type === "company" && (
                        <Popover
                          onOpenChange={() =>
                            setShowCompanyInformation((prev) => !prev)
                          }
                        >
                          <PopoverTrigger asChild>
                            <Eye
                              onClick={() => setCompanyInformation(fournisseur)}
                              className="size-5.5 cursor-pointer text-green-500"
                            />
                          </PopoverTrigger>
                          <PopoverContent className="w-80 text-lg">
                            <div>
                              <p>
                                <span className="text-main  font-medium">
                                  {t("Company ICE")} :{" "}
                                </span>
                                {CompanyInformation?.company_ice}
                              </p>

                              <p>
                                <span className="text-main  font-medium">
                                  {t("Company RC")} :{" "}
                                </span>
                                {CompanyInformation?.company_rc}
                              </p>
                              <p>
                                <span className="text-main  font-medium">
                                  {t("Company TP")} :{" "}
                                </span>
                                {CompanyInformation?.company_tp}
                              </p>
                              <p>
                                <span className="text-main  font-medium">
                                  {t("Company IF")} :{" "}
                                </span>
                                {CompanyInformation?.company_if}
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                      <EditIcon
                        onClick={() => {
                          setDataToAdd(fournisseur);
                          setEdit(true);
                          setOpenKeys(["1"]);
                        }}
                        className="size-5.5 cursor-pointer text-blue-500"
                      />
                      <Trash2
                        onClick={() =>
                          HandleDelete({
                            page: "fournisseurs",
                            id: `${fournisseur.reference}`,
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
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("fournisseurs.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
