package application.interfaces;

import application.DTOObjects.UpdateDTO;
import application.Entities.Aliment;
import application.Entities.FridgeAliment;

public interface IRepoFridge {
    /*
    Search an Aliment from database using the "type" of aliment and add it to the Fridge
    (AI will send probably a type of aliment to be added in the fridge repo, and his quantity)
     */
    FridgeAliment addAliment(String typeAliment, int quantity,int userId);

    /*
    Returns an aliment from the database using his id
    Used when we want to find an Aliment that is saved in the fridge by id
     */
    Aliment findAliment(int userId,int fridgeId);

    /*
    Returns an aliment from the database, using his "type" attribute
     */
    Aliment findAlimentByType(String type);


    /*
        Remove an aliment from the fridge
         */
    void removeAliment(int userId,int alimentId);

    /*
    Get all the aliments from the fridge
     */
    Aliment[] getAllAliments(int userId);

    /*
    Update quantity of the aliment if it's wrong
     */
    void updateAliment(UpdateDTO u, int userId, int alimentId);

    /*
    Used for DELETE method, to see if an aliment is inside the fridge based on his id
     */
    FridgeAliment findFridgeAliment(int userId,int alimentId);
}
