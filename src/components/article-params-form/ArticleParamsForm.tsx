import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import clsx from 'clsx';
import { useState, useLayoutEffect, useRef } from 'react';
import * as constants from '../../constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

import { Select } from '../../ui/select/Select';
import { RadioGroup } from '../../ui/radio-group/RadioGroup';
import { Separator } from '../../ui/separator/Separator';

type ArticleParamsFormProps = {
	articleState: constants.ArticleStateType;
	setArticleState: (param: constants.ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	articleState,
	setArticleState,
}: ArticleParamsFormProps) => {
	// Промежуточное состояние формы
	const [formArticleState, setFormArticleState] =
		useState<constants.ArticleStateType>(articleState);

	//Обобщенная функция для добавления изменений в форме
	const inputChange = (
		key: keyof constants.ArticleStateType,
		value: constants.OptionType
	) => {
		setFormArticleState((prevState) => ({ ...prevState, [key]: value }));
	};

	//Состояние для окна с формой
	const [isOpen, setAsideState] = useState<boolean>(false);

	// Массивы с опциями для селектов и радио группы
	const fontFamilyOptions = constants.fontFamilyOptions;

	const fontSizeOptions = constants.fontSizeOptions;

	const backgroundColorsOptions = constants.backgroundColors;

	const contentWidthArrOptions = constants.contentWidthArr;

	//Ссылка на DOM элемент с aside
	const asideRef = useRef<HTMLElement | null>(null);

	//Закрытие aside если нажимаем вне окна
	const handleClickOutside = (event: MouseEvent) => {
		if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
			setAsideState(false);
		}
	};

	//Вешаем событие для обработки нажатия мыши
	useLayoutEffect(() => {
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<>
			<ArrowButton
				isOpen={isOpen}
				onClick={() => {
					setAsideState((prevState) => !prevState);
				}}
			/>

			{
				<aside
					ref={asideRef}
					className={clsx({
						[styles.container]: true,
						[styles.container_open]: isOpen,
					})}>
					<form className={styles.form}>
						<Text as='h2' size={31} weight={800} uppercase>
							Задайте параметры
						</Text>
						<Select
							selected={formArticleState.fontFamilyOption}
							onChange={(selected: constants.OptionType) => {
								inputChange('fontFamilyOption', selected);
							}}
							options={fontFamilyOptions}
							title='Шрифт'
						/>
						<RadioGroup
							selected={formArticleState.fontSizeOption}
							name='radio'
							onChange={(selected: constants.OptionType) => {
								inputChange('fontSizeOption', selected);
							}}
							options={fontSizeOptions}
							title='Размер Шрифта'
						/>
						<Select
							selected={formArticleState.fontColor}
							onChange={(selected: constants.OptionType) => {
								inputChange('fontColor', selected);
							}}
							options={constants.fontColors}
							title='Цвет Шрифта'
						/>

						<Separator />

						<Select
							selected={formArticleState.backgroundColor}
							onChange={(selected: constants.OptionType) => {
								inputChange('backgroundColor', selected);
							}}
							options={backgroundColorsOptions}
							title='Цвет Фона'
						/>

						<Select
							selected={formArticleState.contentWidth}
							onChange={(selected: constants.OptionType) => {
								inputChange('contentWidth', selected);
							}}
							options={contentWidthArrOptions}
							title='Ширина'
						/>

						<div className={styles.bottomContainer}>
							<Button
								title='Сбросить'
								htmlType='reset'
								type='clear'
								onClick={() => {
									setArticleState(constants.defaultArticleState);
									setFormArticleState(constants.defaultArticleState);
								}}
							/>
							<Button
								title='Применить'
								onClick={() => {
									setArticleState(formArticleState);
									setAsideState(false);
								}}
								htmlType='button'
								type='apply'
							/>
						</div>
					</form>
				</aside>
			}
		</>
	);
};
