import { FindDoctors, Map, SomethingIs } from "../../Components"
import MainLayout from "../../Layout/MainLayout"

const HomePage = () => {
  return (
    <MainLayout>
     <Map />
     <SomethingIs />
     <FindDoctors/>
    </MainLayout>
  )
}

export default HomePage
