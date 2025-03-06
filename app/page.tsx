import React from 'react'
import *  as Button from '@/components/ui/button'
const HomePage = () => {
  return (
		<div>
			{" "}
			<div className="flex flex-col items-center gap-4">
				<Button.Root variant="neutral" mode="filled">
					Learn More
				</Button.Root>
				<Button.Root variant="neutral" mode="stroke">
					Learn More
				</Button.Root>
				<Button.Root variant="neutral" mode="lighter">
					Learn More
				</Button.Root>
				<Button.Root variant="neutral" mode="ghost">
					Learn More
				</Button.Root>
			</div>
		</div>
	);
}

export default HomePage