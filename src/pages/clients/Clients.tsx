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
import Title from "@/components/ui/Title";
import Error from "@/components/ui/Error";
import LoadingSpinner from "@/components/others/LoadingLogo";
import { clients, companyPapers } from "@/lib/database";
import fetchData from "@/apis/HandleGetTable";
import { HandleDelete } from "@/apis/HandleDelete";
import { FormPreNumbers } from "@/common/Functions";
import AddClient from "@/components/clients/AddClient";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Clients() {
  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [dataToAdd, setDataToAdd] = useState<clients | null>(null);
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
    data: clients[];
    loading: boolean;
    refresh: () => void;
    error: boolean;
  } = fetchData({
    page: "clients",
  });

  const handleAccordionChange = (value: string) => {
    setOpenKeys(value ? [value] : []);
  };

  if (error) {
    return <Error title={t("clients.error.loading")} />;
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
            <Title title={edit ? t("clients.edit") : t("clients.add")} />
          </AccordionTrigger>
          <AccordionContent>
            <AddClient
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
        <Title title={t("clients.your")} />
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
              data.map((client, id) => (
                <TableRow key={id}>
                  <TableCell className="capitalize">
                    <p className="text-base font-medium">{`${client.fname} ${client.lname}`}</p>
                    <p className="text-gray-500 -mt-0.5">
                      {FormPreNumbers(`${client.reference}`)}
                    </p>
                  </TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell>{t(client.type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {client.type === "company" && (
                        <Popover
                          onOpenChange={() =>
                            setShowCompanyInformation((prev) => !prev)
                          }
                        >
                          <PopoverTrigger asChild>
                            <Eye
                              onClick={() => setCompanyInformation(client)}
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
                          setDataToAdd(client);
                          setEdit(true);
                          setOpenKeys(["1"]);
                        }}
                        className="size-5.5 cursor-pointer text-blue-500"
                      />
                      <Trash2
                        onClick={() =>
                          HandleDelete({
                            page: "clients",
                            id: `${client.reference}`,
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
                  {t("clients.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
