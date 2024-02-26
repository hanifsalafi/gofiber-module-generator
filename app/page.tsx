'use client'

import { controllerCode } from "@/components/template/codes/controller";
import { repositoryCode } from "@/components/template/codes/repository";
import { serviceCode } from "@/components/template/codes/service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { camelToSnakeCase, cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { CopyBlock, dracula } from 'react-code-blocks';
import { parseSQLStringToJson } from "@/lib/utils";
import { requestCode } from "@/components/template/codes/request";
import { responseCode } from "@/components/template/codes/response";
import { mapperCode } from "@/components/template/codes/mapper";
import JSZip from "jszip";
import { mainControllerCode } from "@/components/template/codes/main-controller";
import { mainModuleCode } from "@/components/template/codes/main-module";

export default function Home() {

  const [project, setProject] = useState("");
  const [module, setModule] = useState("");
  const [sql, setSQL] = useState("");
  const [controller, setController] = useState("");
  const [repository, setRepository] = useState("");
  const [service, setService] = useState("");
  const [request, setRequest] = useState("");
  const [response, setResponse] = useState("");
  const [mapper, setMapper] = useState("");
  const [mainController, setMainController] = useState("");
  const [mainModule, setMainModule] = useState("");

  const generateCode = () => {
    setController(controllerCode({ project: project, module: module }));
    setService(serviceCode({ project: project, module: module }));
    setRepository(repositoryCode({ project: project, module: module }));
    setRequest(requestCode({ project: project, module: module, columns: parseSQLStringToJson(sql) }));
    setResponse(responseCode({ project: project, module: module, columns: parseSQLStringToJson(sql) }));
    setMapper(mapperCode({ project: project, module: module, columns: parseSQLStringToJson(sql) }));
    setMainController(mainControllerCode({ project: project, module: module }));
    setMainModule(mainModuleCode({ project: project, module: module }));
  }

  const downloadCode = async () => {
    const zip = new JSZip();

    const folders = [
      { name: 'service', fileName: `${camelToSnakeCase(module)}.service.go`, fileContent: service },
      { name: 'controller', fileName: `controller.go`, fileContent: mainController },
      { name: 'controller', fileName: `${camelToSnakeCase(module)}.controller.go`, fileContent: controller },
      { name: 'repository', fileName: `${camelToSnakeCase(module)}.repository.go`, fileContent: repository },
      { name: 'mapper', fileName: `${camelToSnakeCase(module)}.mapper.go`, fileContent: mapper },
      { name: 'request', fileName: `${camelToSnakeCase(module)}.request.go`, fileContent: request },
      { name: 'response', fileName: `${camelToSnakeCase(module)}.response.go`, fileContent: response }
    ];
    for (const folder of folders) {
      zip?.folder(folder.name)?.file(folder.fileName, folder.fileContent);
    }
    zip.file(`${camelToSnakeCase(module)}.module.go`, mainModule);
    let content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${camelToSnakeCase(module)}.zip`;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="w-full p-5">
        <CardHeader>
          <CardTitle>Gofiber Code Generator</CardTitle>
          <CardDescription>Mengubah database table yang dibuat dari diagramdb.com menjadi gofiber code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-3">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="project">Project</Label>
              <Input placeholder="Type your project here." id="project" onChange={(e) => setProject(e.target.value)} />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="module">Module</Label>
              <Input placeholder="Type your module here." id="module" onChange={(e) => setModule(e.target.value)} />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="sql">SQL</Label>
              <Textarea placeholder="Type your sql here." id="sql" onChange={(e) => setSQL(e.target.value)} />
            </div>
            <Button type="button" onClick={generateCode}>Generate Code</Button>
            {controller &&
              <Button type="button" onClick={downloadCode}>Download Code</Button>
            }
          </div>
          <div className="grid w-full gap-1.5 mt-4">
            {controller &&
              <div className="py-3 gap-2">
                <Label className="mb-2">Controller</Label>
                <CopyBlock
                  text={controller}
                  language={'go'}
                  showLineNumbers={true}
                  theme={dracula}
                  wrapLongLines
                />
              </div>
            }
            {repository &&
              <div className="py-3">
                <Label className="mb-2">Repository</Label>
                <CopyBlock
                  text={repository}
                  language={'go'}
                  showLineNumbers={true}
                  theme={dracula}
                  wrapLongLines
                />
              </div>
            }
            {service &&
              <div className="py-3">
                <Label>Service</Label>
                <CopyBlock
                  text={service}
                  language={'go'}
                  showLineNumbers={true}
                  theme={dracula}
                  wrapLongLines
                />
              </div>
            }
            {request &&
              <div className="py-3">
                <Label className="mb-2">Request</Label>
                <CopyBlock
                  text={request}
                  language={'go'}
                  showLineNumbers={true}
                  theme={dracula}
                  wrapLongLines
                />
              </div>
            }
            {response &&
              <div className="py-3">
                <Label className="mb-2">Response</Label>
                <CopyBlock
                  text={response}
                  language={'go'}
                  showLineNumbers={true}
                  theme={dracula}
                  wrapLongLines
                />
              </div>
            }
            {mapper &&
              <div className="py-3">
                <Label className="mb-2">Mapper</Label>
                <CopyBlock
                  text={mapper}
                  language={'go'}
                  showLineNumbers={true}
                  theme={dracula}
                  wrapLongLines
                />
              </div>
            }
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
