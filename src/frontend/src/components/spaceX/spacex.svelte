<!-- //   {
    //     "id": 1,
    //     "active": false,
    //     "stages": 2,
    //     "boosters": 0,
    //     "cost_per_launch": 6700000,
    //     "success_rate_pct": 40,
    //     "first_flight": "2006-03-24",
    //     "country": "Republic of the Marshall Islands",
    //     "company": "SpaceX",
    //     "wikipedia": "https://en.wikipedia.org/wiki/Falcon_1",
    //     "description": "The Falcon 1 was an expendable launch system privately developed and manufactured by SpaceX during 2006-2009. On 28 September 2008, Falcon 1 became the first privately-developed liquid-fuel launch vehicle to go into orbit around the Earth.",
    //     "rocket_id": "falcon1",
    //     "rocket_name": "Falcon 1",
    //     "rocket_type": "rocket"
    //   } -->

<script lang="ts">
  interface Rocket {
    id: number
    active: boolean
    stages: number
    boosters: number
    cost_per_launch: number
    success_rate_pct: number
    first_flight: string
    country: string
    company: string
    wikipedia: string
    description: string
    rocket_id: string
    rocket_name: string
    rocket_type: string
  }

  import { onMount } from 'svelte'

  // Astro has a built-in fetch function
  // Its available in "---" filed or other components globally
  // It will render pages at the build time and then hydrate them on the client

  // For client side data fetching, we can use axios or others, but fetch does not fire up
  import { axiosBackendInstance } from '@axios/axiosBackendInstance.ts'

  const getSpaceXRockets = async () => {
    try {
      const res = await axiosBackendInstance.get('space-x')
      const data = res.data
      return data
    } catch (error) {
      // implement error handling
      // console.log(error)
      return []
    }
  }

  let data: Rocket[] = []
  let error: string | null = null

  onMount(async () => {
    const res = await getSpaceXRockets()
    data = res
  })
</script>

<div>
  <h3>Svelte Component (Client side call example)</h3>
  {#each data as rocket}
    <ul>
      <li>
        <h1>{rocket.rocket_name}</h1>
        <p>{rocket.description}</p>
      </li>
    </ul>
  {/each}
</div>

<style>
  ul {
    list-style: none;
    padding: 0;
  }
</style>
