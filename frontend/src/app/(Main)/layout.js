import MainLayout from "@/components/layout/MainLayout";

function layout({children}) {
  return (
    <div>
      <MainLayout>
        {children}
      </MainLayout>
    </div>
  )
}

export default layout
