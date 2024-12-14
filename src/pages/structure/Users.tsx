import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Title from "@/components/ui/Title";
import AddUser from "./AddUsers";
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
import { users } from "@/lib/database";
import { EditIcon, Plus, Trash2 } from "lucide-react";
import { HandleDelete } from "@/apis/HandleDelete";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";

export default function Users() {
  const { t } = useTranslation();

  const [infos, setInfos] = useState<users | null>(null);
  const {
    data,
    refresh,
    loading,
  }: { data: users[]; refresh: () => void; loading: boolean } = fetchData({
    page: "users",
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
              <Plus /> {updating ? t("users.edit") : t("users.add")}
            </Button>
          </AccordionTrigger>
          <AccordionContent>
            <AddUser
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
        <Title title={t("users.your")} />
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("phone")}</TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead>{t("role")}</TableHead>
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
              data.map((user) => (
                <TableRow key={user.reference}>
                  <TableCell className="capitalize flex items-center gap-2">
                    <div
                      className="rounded-full size-2.5"
                      style={{ backgroundColor: user.banned ? "red" : "green" }}
                    />
                    {`${user.fname} ${user.lname}`}
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      color={
                        user.role === "admin"
                          ? "destructive"
                          : user.role === "preparator"
                          ? "primary"
                          : user.role === "technicocommercial"
                          ? "secondary"
                          : user.role === "cashier"
                          ? "warning"
                          : "success"
                      }
                    >
                      {t(user.role)}
                    </Chip>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <EditIcon
                      onClick={() => {
                        setInfos(user);
                        setUpdating(true);
                        setOpenKeys(["1"]);
                      }}
                      className="size-5.5 cursor-pointer text-blue-500"
                    />
                    <Trash2
                      onClick={() =>
                        HandleDelete({
                          page: "users",
                          id: `${user.reference}`,
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
                  {t("users.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
