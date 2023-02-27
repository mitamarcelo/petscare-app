export type Pet = {
  id?: number;
  name: string;
  bio: string;
  gender: string;
  breed: string;
  species: string;
  dob: Date;
};

export type Options = {
  species: string[];
  genders: string[];
};
