import { useState, useRef, useEffect } from 'react'
import { ChakraProvider, Text, Heading, Flex, Button, Spacer } from '@chakra-ui/react'
import { ChakraUITable } from 'react-chakra-ui-table'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Example Table
const TodoListTable = () => {
  const columns = [
    {
      Header: '#',
      Cell: ({ row }) => (<Text>{row.index + 1}</Text>)
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Title',
      accessor: 'title',
    },
    {
      Header: 'Completed',
      accessor: 'completed',
      Cell: ({ value }) => (value ? '/' : 'x')
    },
  ]

  const [data, setData] = useState(null)

  const loadData = useRef()
  loadData.current = async () => {
    const urls = ['https://jsonplaceholder.typicode.com/users', 'https://jsonplaceholder.typicode.com/todos']
    try {
      const result = await Promise.all(
        urls.map(url => fetch(url).then(r => r.json()))
      )

      if (result.length === 2) {
        // index 0 is user
        // index 1 is todo
        const todoList = result[1].map(todo => {
          todo.user = result[0].find(i => i.id === todo.userId)
          todo.name = todo.user?.name
          return todo
        })

        setData(todoList)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadData.current()
  }, [])

  return (
    data &&
    <Flex w='100%' direction='column'>
      <Flex>
        <Spacer />
        <PrintButton options={{
          title: "Table of Users",
          subTitle: "A Demo Table Using React-Chakra-ui-Table :)"
        }
        } />
      </Flex>
      <ChakraUITable columns={columns} data={data} id="my-table" />
    </Flex>
  )
}

const PrintButton = ({ options }) => {

  const printHandle = () => {
    const doc = new jsPDF()
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    doc.setTextColor("#00f");
    doc.text(options.title, pageWidth / 2, 10, { align: 'center' });

    doc.setTextColor("#444");
    doc.setFontSize(15);
    doc.text(options.subTitle, pageWidth / 2, 20, { align: 'center' });
    autoTable(doc, {
      html: '#my-table',
      margin: { top: 26 }
    })
    // doc.save('autoprint.pdf');
    doc.autoPrint();
    //This is a key for printing
    doc.output("dataurlnewwindow");
  }

  return (
    <Button colorScheme='teal' onClick={printHandle}>Print</Button>
  )
}

const App = () => {
  return (
    <ChakraProvider>
      <Flex p={6} direction="column">
        <Heading mb={4}>Table</Heading>
        <TodoListTable />
      </Flex>
    </ChakraProvider>
  )
}

export default App