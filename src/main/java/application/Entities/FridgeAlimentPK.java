package application.Entities;

import java.io.Serializable;
import java.util.Objects;

public class FridgeAlimentPK implements Serializable {
    private int userId;
    private int alimentId;

    public FridgeAlimentPK(int userId, int alimentId) {
        this.userId = userId;
        this.alimentId = alimentId;
    }

    public FridgeAlimentPK() {
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getAlimentId() {
        return alimentId;
    }

    public void setAlimentId(int alimentId) {
        this.alimentId = alimentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FridgeAlimentPK that = (FridgeAlimentPK) o;
        return userId == that.userId &&
                alimentId == that.alimentId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, alimentId);
    }
}
