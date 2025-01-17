import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import Image from 'next/image';

import { deleteImage, uploadFile } from '@/actions/file-upload';
import { createServer } from '@/actions/server';
import useUploadFile from '@/hooks/useFileUpload';
import { Button } from '../../ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '../../ui/form';
import { Input } from '../../ui/input';

const schema = z.object({
	name: z.string(),
	logo: z.string(),
});

export default function CreateServerForm({
	handleClose,
}: {
	handleClose: () => void;
}) {
	const form = useForm<z.infer<typeof schema>>({
		defaultValues: {
			logo: '',
			name: '',
		},
		resolver: zodResolver(schema),
	});

	const { handleChange, preview, files } = useUploadFile(form);
	const isValid = form.formState.isValid;
	const isSubmitting = form.formState.isSubmitting;

	async function onSubmit(data: z.infer<typeof schema>) {
		if (!files) return;

		const file = await uploadFile(files.logo);

		try {
			if (!file) throw new Error('file is missing');
			await createServer(data.name, file.url, file.publicId);
			toast.success('Server has been created 🥳');
			handleClose();
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error?.message);
			} else {
				toast.error('Error create server');
			}
			if (file) {
				await deleteImage(file?.publicId);
			}
		}
	}

	return (
		<Form {...form}>
			<form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
				<div className='flex justify-center'>
					{preview && preview.logo ? (
						<Image
							src={preview.logo}
							width={100}
							height={100}
							alt='cover'
							className='aspect-auto size-28 rounded-full object-cover'
						/>
					) : (
						<FormField
							control={form.control}
							name='logo'
							render={() => (
								<FormItem>
									<FormLabel
										htmlFor='logo'
										className='relative mx-auto mt-3 flex size-24 cursor-pointer  flex-col items-center justify-center rounded-full border border-dashed'
									>
										<Camera size={30} />
										<p className='py-2 text-xs font-semibold uppercase'>
											Upload
										</p>
										<div className='bg-secondary-purple absolute right-0 top-0 flex size-7 items-center justify-center rounded-full'>
											<Plus size={20} stroke='#fff' fill='#fff' />
										</div>
									</FormLabel>
									<FormControl>
										<Input
											onChange={(e) => handleChange(e, 'logo')}
											id='logo'
											name='file'
											accept='.jpg,.png,.jpeg'
											className='hidden'
											placeholder='Server logo'
											type='file'
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					)}
				</div>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Server name</FormLabel>
							<FormControl>
								<>
									<Input
										autoComplete='off'
										placeholder='Server name'
										className='bg-[var(--primary)] ring-offset-[[var(--primary)]]  focus:border-none focus:shadow-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-transparent'
										required
										aria-disabled={isSubmitting || !isValid}
										disabled={isSubmitting || !isValid}
										{...field}
									/>
									<p className='text-xs font-light leading-relaxed'>
										By createing a server, you&apos;re agree to discord{' '}
										<span className='text-secondary-purple font-semibold'>
											Community Guidelines
										</span>
									</p>
								</>
							</FormControl>
						</FormItem>
					)}
				/>

				<div className='flex items-center justify-between'>
					<Button
						onClick={handleClose}
						type='button'
						className='bg-[var(--primary)] text-white'
					>
						Back
					</Button>
					<Button
						disabled={!isValid || isSubmitting}
						type='submit'
						className='bg-secondary-purple text-white'
					>
						{isSubmitting ? (
							<div className='flex items-center gap-2'>
								<div className='ease size-5 animate-spin rounded-full border-t-2 border-t-white transition-all duration-500'></div>
								<p>Please wait...</p>
							</div>
						) : (
							'Create'
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
