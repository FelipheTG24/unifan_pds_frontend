"use client"
import { useEffect, useState, useRef, FormEvent } from "react";
import { FiTrash, FiEdit, FiCheck } from "react-icons/fi"
import { api } from "./api";

interface PagamentoProps {
  id: string;
  description: string;
  valores_id: string;
  statusPagamento: boolean;
  dataHoraPagamento: string;

}

export default function Home() {

  // Linkar os inputs
  const descriptionRef = useRef<HTMLInputElement | null>(null)
  const dateRef = useRef<HTMLInputElement | null>(null)

  // Inicializa lista de tarefas da página como lista vazia
  const [pagamento, setPagamentos] = useState<PagamentoProps[]>([])

  // Ao renderizar a página, chama a função "readPagamentos"
  useEffect(() => {
    readPagamentos();
  }, [])

  // Busca as tarefas no banco de dados via API
  async function readPagamentos() {
    const response = await api.get("/pagamento")
    console.log(response.data)
    setPagamentos(response.data)
  }

  // Cria uma nova tarefa
  async function createPagamento(event: FormEvent) {
    event.preventDefault()
    const response = await api.post("/pagamento", {
      description: descriptionRef.current?.value,
      date: dateRef.current?.value
    }) 
    setPagamentos(allPagamentos => [...allPagamentos, response.data])
  }

  // Deleta uma tarefa
  async function deletePagamento(id: string){
    try{
      await api.delete("/pagamento/" + id)
      const allPagamentos = pagamento.filter((task) => task.id !== id)
      setPagamentos(allPagamentos)
    }
    catch(err){
      alert(err)
    }
  }

  async function setPagamentoDone(id:string) {
    try {
      await api.put("/pagamento/" + id, {
        status: true,
      })
      const response = await api.get("/pagamento")
      setPagamentos(response.data)
    }
    catch(err){
      alert(err)
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-500 flex justify-center px-4">
      <main className="my-10 w-full lg:max-w-5xl">
        <section>
          <h1 className="text-4xl text-slate-200 font-medium text-center">To Do List</h1>

          <form className="flex flex-col my-6" onSubmit={createPagamento}>
          
            <label className="text-slate-200">Pagamento Description</label>
            <input type="text" className="w-full mb-5 p-2 rounded" ref={descriptionRef}/>

            <label className="text-slate-200">Date</label>
            <input type="date" className="w-full mb-5 p-2 rounded" ref={dateRef} />

            <input type="submit" value={"Add Pagamento"} className="cursor-pointer w-full bg-slate-800 rounded font-medium text-slate-200 p-4" />
          </form>

        </section>
        <section className="mt-5 flex flex-col">

          {pagamento.map((task) => (
            <article className="w-full bg-slate-200 text-slate-800 p-2 mb-4 rounded relative hover:bg-sky-300" key={task.id}>
              <p>{task.description}</p>
              <p>{new Date(task.dataHoraPagamento).toLocaleDateString()}</p>
              <p>{task.statusPagamento.toString()}</p>


              <button className="flex absolute right-10 -top-2 bg-green-600 w-7 h-7 items-center justify-center text-slate-200" onClick={() => setPagamentoDone(task.id)}><FiCheck></FiCheck></button>

              <button className="flex absolute right-0 -top-2 bg-red-600 w-7 h-7 items-center justify-center text-slate-200" onClick={() => deletePagamento(task.id)}><FiTrash></FiTrash></button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
