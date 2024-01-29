/*
*    icons.js
*    icon array to load the markers based in the incident offense description of the crime 
*/


const CRIMEOMETER_ICON_BASE = 'https://homeluten.com/images/crime-icons/'
const CRIMEOMETER_ICON_MAPPING = {
    'Shoplifting': {
        icon: CRIMEOMETER_ICON_BASE + 'building.png',
    },
    'Theft From Building': {
        icon: CRIMEOMETER_ICON_BASE + 'building.png',
    },
    'Theft From Coin-Operated Machine or Device': {
        icon: CRIMEOMETER_ICON_BASE + 'building.png',
    },
    'Drug/Narcotic Violations': {
        icon: CRIMEOMETER_ICON_BASE + 'drug.png'
    },
    'Drug Equipment Violations': {
        icon: CRIMEOMETER_ICON_BASE + 'drug.png'
    },
    'Burglary/Breaking & Entering': {
        icon: CRIMEOMETER_ICON_BASE + 'house.png'
    },
    'Trespass of Real Property': {
        icon: CRIMEOMETER_ICON_BASE + 'house.png'
    },
    'Child Abuse/Aggravated/Physical abuse': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Child Abuse/Simple/Psychological abuse': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Child Abuse/Sexual abuse': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Child Abuse/Neglect': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Sexual Assault': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Sexual Battery': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Sex Offense/All Other': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Rape': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Sodomy': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Sexual Assault With An Object': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Fondling': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Incest': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Statutory Rape': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'All Other Larceny': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Pocket-picking': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Purse-snatching': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Human Trafficking, Commercial Sex Acts': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Human Trafficking, Involuntary Servitude': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Kidnapping/Abduction': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Robbery': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Extortion/Blackmail': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Aggravated Assault': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Simple Assault': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Intimidation': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Bribery': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Weapon Law Violations': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Domestic Violence/Aggravated Assault': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Domestic Violence/Simple Assault': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Domestic Violence/Intimidation': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Human Trafficking/All Other': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Eldery Abuse/All Other': {
        icon: CRIMEOMETER_ICON_BASE + 'person.png'
    },
    'Murder & Non-negligent Manslaughter': {
        icon: CRIMEOMETER_ICON_BASE + 'homicide.png'
    },
    'Negligent Manslaughter': {
        icon: CRIMEOMETER_ICON_BASE + 'homicide.png'
    },
    'Justifiable Homicide': {
        icon: CRIMEOMETER_ICON_BASE + 'homicide.png'
    },
    'Suspicious Person': {
        icon: CRIMEOMETER_ICON_BASE + 'suspicious.png'
    },
    'Suspicious Vehicle': {
        icon: CRIMEOMETER_ICON_BASE + 'suspicious.png'
    },
    'Suspicious Activity/All Other': {
        icon: CRIMEOMETER_ICON_BASE + 'suspicious.png'
    },
    'Disorderly Conduct': {
        icon: CRIMEOMETER_ICON_BASE + 'vandalism.png'
    },
    'Destruction/Damage/Vandalism of Property': {
        icon: CRIMEOMETER_ICON_BASE + 'vandalism.png'
    },
    'Motor Vehicle Theft': {
        icon: CRIMEOMETER_ICON_BASE + 'vehicle.png'
    },
    'Theft From Motor Vehicle': {
        icon: CRIMEOMETER_ICON_BASE + 'vehicle.png'
    },
    'Theft of Motor Vehicle Parts or Accessories': {
        icon: CRIMEOMETER_ICON_BASE + 'vehicle.png'
    },
    'All Other Offenses': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Family Offenses/All Other': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Bad Checks': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Curfew/Loitering/Vagrancy Violations': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Driving Under the Influence': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Drunkenness': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Family Offenses, Nonviolent': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Liquor Law Violations': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Peeping Tom': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Stolen Property Offenses': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Pornography/Obscene Material': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Prostitution': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Assisting or Promoting Prostitution': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Purchasing Prostitution': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Betting/Wagering': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Operating/Promoting/Assisting Gambling': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Gambling Equipment Violations': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Sports Tampering': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Embezzlement': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'False Pretenses/Swindle/Confidence Game': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Credit Card/Automated Teller Machine Fraud': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Impersonation': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Welfare Fraud': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Wire Fraud': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Identity Theft': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Hacking/Computer Invasion': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Counterfeiting/Forgery': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Animal Cruelty': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    },
    'Arson': {
        icon: CRIMEOMETER_ICON_BASE + 'other.png'
    }  
};

function loadCrimeoMeterIconMapping(CRIMEOMETER_ICON_MAPPING) {
    window.CRIMEOMETER_ICON_MAPPING = CRIMEOMETER_ICON_MAPPING;
}
injectWindowObj(loadCrimeoMeterIconMapping, CRIMEOMETER_ICON_MAPPING);