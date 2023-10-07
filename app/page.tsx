import { BiFootball,BiGroup,BiNews } from 'react-icons/bi'
import { FaFootball,FaTeamspeak } from 'react-icons/fa6'
import { MdOutlineScoreboard } from 'react-icons/md'
import { GiBorderedShield,GiRosaShield } from 'react-icons/gi'
import { Query, database } from '@/appwrite'
import moment from 'moment'
import GroupPill from '@/components/GroupPill'
import FixturePill from '@/components/FixturePill'
import TeamPill from '@/components/TeamPill'
import { redirect } from 'next/navigation'
const { NEXT_PUBLIC_APPWRITE_DATABASE_ID } = process.env;

export const revalidate = 0;

const getData:any = async (stageId = null) => {
  let stages = await database.listDocuments(NEXT_PUBLIC_APPWRITE_DATABASE_ID!,"stage",[]); // Onclick on Stage Load Knockout Data but by Default Current Stage Knockout Data
  let teams = await database.listDocuments(NEXT_PUBLIC_APPWRITE_DATABASE_ID!,"team",[]);
  let tables = await database.listDocuments(NEXT_PUBLIC_APPWRITE_DATABASE_ID!,"table",[]);
  
  // Current Stage where Default is true
  let stage:any = stageId 
      ? await database.listDocuments(NEXT_PUBLIC_APPWRITE_DATABASE_ID!,"stage", stageId)  // Load Knockout Stage with StageId
      : await database.listDocuments(NEXT_PUBLIC_APPWRITE_DATABASE_ID!,"stage",[ Query.equal("default", true) ]); // Load Default Knockout Stage
      
  // Fetch Knockout Data with stage.documents[0].$id
  let knockouts = await database.listDocuments(NEXT_PUBLIC_APPWRITE_DATABASE_ID!,"knockout",[ Query.equal("stage", stage.documents[0].$id) ]);
  // Fetch Fixtures for Current Stage
  let fixture = await database.listDocuments(NEXT_PUBLIC_APPWRITE_DATABASE_ID!,"fixture",[ Query.equal("stage", stage.documents[0].$id) ]);
  
  const data = await Promise.all([fixture,teams,stage,stages,tables,knockouts])
  return data;
}

export default async function Home({ searchParams }: { searchParams: { stage: string }}) {
  
  const stageId = searchParams.stage;
  const data: any = await getData(stageId);
  
  const formatTableData = () => {
    const gdata = new Map();
    for(const tb of data[4].documents){
       const row:any = { ...tb, group: tb.group.name, team: tb.team.name }
       if(gdata.has(row.group)){
       const dm = gdata.get(row.group);
         gdata.set(row.group, [...dm, row ])
       } else {
         gdata.set(row.group, [row])
       }
    }
    return Array.from(gdata);
  }

  const formatKnockoutData = () => {
    const gdata = new Map();
    for(const tb of data[5].documents){
       const row:any = { ...tb, group: tb.group.name, team: tb.team.name }
       if(gdata.has(row.group)){
        const dm = gdata.get(row.group);
         gdata.set(row.group, [...dm, row ])
       } else {
         gdata.set(row.group, [row])
       }
    }
    return Array.from(gdata);
  }

  const tables = formatTableData()
  console.log("Tables:", tables)
  const knockouts = await formatKnockoutData()


  return (
  <div className="w-full ">
    <div className="mx-auto w-full md:max-w-7xl bg-slate-50 md:border-x border-dashed border-gray-600 shadow-lg backdrop-blur-lg">
      
       {/* Advertisement & Sponsors - #00141e */}
       <header className="px-6 w-full h-24 bg-[#001e28] flex items-center justify-between space-x-4">
         <div className="flex flex-col">
            <span className="text-white font-arial font-black text-[2rem] md:text-6xl tracking-[0.4em]">USL</span>
            <span className="text-white font-tahoma font-normal  text-[0.55em] md:text-base tracking-wider">UCC STAFF LEAGUE</span>
         </div>
         <nav className="md:h-20 flex items-center bg-red-50 rounded-sm md:rounded-md text-blue-950">
          <div className="p-2 md:p-6 font-black text-sm md:text-lg border-r-2 border-dashed border-blue-950 flex items-center space-x-2">
            <MdOutlineScoreboard className="w-5 md:w-7 h-5 md:h-7" />
            <span>Scores</span>
          </div>
          <div className="p-2 md:p-6 font-black text-sm md:text-lg flex items-center space-x-2">
            <BiNews className="w-5 md:w-7 h-5 md:h-7" />
            <span>News</span>
          </div>
         </nav>
       </header>

       {/* Content Page */}
       <main className="w-full flex flex-col md:flex-row">

          {/* Teams Sidebar */}
          <div className="order-3 md:order-1 px-4 py-6 w-full md:w-72 h-full md:h-screen md:border-r-2 border-red-100 bg-red-50 space-y-4">
            <h1 className="text-xs md:text-sm font-semibold">MEMBER TEAMS</h1>
            <nav className="space-y-3">
              {data[1]?.documents?.map((row:any) => (
                 <TeamPill key={row.$id} row={row} />
              ))}
            </nav>
            <div className="w-full py-1"></div>
            <h1 className="text-xs md:text-sm font-semibold">LEAGUE STAGES</h1>
            <nav className="space-y-3">
              {data[3]?.documents?.sort((a:any, b:any) => a.order-b.order).map((row:any) => (
                 <TeamPill key={row.$id} row={row} />
              ))}
            </nav>
          </div>

          {/* Inner Page */}
          <div className="order-1 md:order-2 p-4 flex-1 space-y-10">
              <div className="p-2 md:p-4 rounded-r-md bg-gray-50/50 border-l-8 border-blue-950 shadow-md">
                <h1 className="font-bold text-xs md:text-sm tracking-widest">MEN FOOTBALL -  FIXTURES</h1>
              </div>
             
              <div className="w-full space-y-1">
                { data[0]?.documents?.map((row:any) => (
                 <FixturePill key={row.$id} row={row} />
                ))}
              </div>
          </div>

          {/*  Group Table */}
          <div className="order-2 md:order-3 py-4 px-2 w-full md:w-96 bg-blue-100/50 space-y-2 md:space-y-4">
             <div className="p-2 md:p-4 rounded-r-md bg-gray-50/50 border-l-8 border-red-800 shadow-md">
                <h1 className="font-bold text-xs md:text-sm tracking-widest">TABLE STANDINGS</h1>
             </div>
             <div className="space-y-3">
                { tables?.map(([key,data]:any) => (
                 <GroupPill key={key} title={key} data={data.sort((a:any,b:any) => b.points - a.points)} />
                ))}
             </div>
          </div>
       </main>
        
    </div>
   </div>
  )
}