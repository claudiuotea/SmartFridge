package application.interfaces;

import application.Entities.Aliment;

/*
This repository is used to add the possible aliments that will be recognized by the fridge
 */
public interface IRepoAliments {
    //add a new possible Aliment to the database
    int addAliment(Aliment a);
    //Find and return an Alimen based on his id
    Aliment findAliment(int id);
    //Remove an aliment from the database (it can't be in the fridge anymore after removing)
    void removeAliment(int id);
    //get all the possible Aliments
    Aliment[] getAllAliments();
    //Update an aliment (everything excluding his id)
    void updateAliment(Aliment a);

    String[] getAllTypes();
}
