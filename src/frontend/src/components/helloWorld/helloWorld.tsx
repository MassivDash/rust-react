import { useEffect, useState } from 'react'
import { axiosBackendInstance } from '@axios/axiosBackendInstance'

export const HelloWorld = () => {
  const [data, setData] = useState<string | null>('')

  useEffect(() => {
    axiosBackendInstance.get('/hello').then((response) => {
      setData(response.data.message)
    })
  }, [])

  return (
    <div>
      <h3>React Island</h3>
      <p>{data !== '' ? data : 'fetching /hello'}</p>
    </div>
  )
}
